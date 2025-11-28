import { StreamParser } from '@codemirror/language';

// Terraform block types
const BLOCK_TYPES = new Set([
  'check',
  'data',
  'import',
  'locals',
  'module',
  'moved',
  'output',
  'provider',
  'removed',
  'resource',
  'terraform',
  'variable'
]);

// Terraform built-in functions
const BUILTIN_FUNCTIONS = new Set([
  // Numeric functions
  'abs',
  'ceil',
  'floor',
  'log',
  'max',
  'min',
  'parseint',
  'pow',
  'signum',
  // String functions
  'chomp',
  'endswith',
  'format',
  'formatlist',
  'indent',
  'join',
  'lower',
  'regex',
  'regexall',
  'replace',
  'split',
  'startswith',
  'strcontains',
  'strrev',
  'substr',
  'templatestring',
  'title',
  'trim',
  'trimprefix',
  'trimsuffix',
  'trimspace',
  'upper',
  // Collection functions
  'alltrue',
  'anytrue',
  'chunklist',
  'coalesce',
  'coalescelist',
  'compact',
  'concat',
  'contains',
  'distinct',
  'element',
  'flatten',
  'index',
  'keys',
  'length',
  'list',
  'lookup',
  'map',
  'matchkeys',
  'merge',
  'one',
  'range',
  'reverse',
  'setintersection',
  'setproduct',
  'setsubtract',
  'setunion',
  'slice',
  'sort',
  'sum',
  'transpose',
  'values',
  'zipmap',
  // Encoding functions
  'base64decode',
  'base64encode',
  'base64gzip',
  'csvdecode',
  'jsondecode',
  'jsonencode',
  'textdecodebase64',
  'textencodebase64',
  'urlencode',
  'yamldecode',
  'yamlencode',
  // Filesystem functions
  'abspath',
  'dirname',
  'pathexpand',
  'basename',
  'file',
  'fileexists',
  'fileset',
  'filebase64',
  'templatefile',
  // Date and time functions
  'formatdate',
  'plantimestamp',
  'timeadd',
  'timecmp',
  'timestamp',
  // Hash and crypto functions
  'base64sha256',
  'base64sha512',
  'bcrypt',
  'filebase64sha256',
  'filebase64sha512',
  'filemd5',
  'filesha1',
  'filesha256',
  'filesha512',
  'md5',
  'rsadecrypt',
  'sha1',
  'sha256',
  'sha512',
  'uuid',
  'uuidv5',
  // IP network functions
  'cidrhost',
  'cidrnetmask',
  'cidrsubnet',
  'cidrsubnets',
  // Type conversion functions
  'can',
  'issensitive',
  'nonsensitive',
  'sensitive',
  'tobool',
  'tolist',
  'tomap',
  'tonumber',
  'toset',
  'tostring',
  'try',
  'type',
  // Terraform-specific
  'provider',
  'terraform'
]);

// Type keywords
const TYPE_KEYWORDS = new Set([
  'any',
  'string',
  'number',
  'bool',
  'list',
  'map',
  'set',
  'object',
  'tuple'
]);

// Language constants
const CONSTANTS = new Set(['true', 'false', 'null']);

// Common attribute names
const COMMON_ATTRIBUTES = new Set([
  'count',
  'depends_on',
  'for_each',
  'lifecycle',
  'providers',
  'source',
  'version',
  'description',
  'default',
  'type',
  'sensitive',
  'nullable',
  'validation',
  'condition',
  'error_message',
  'value',
  'create_before_destroy',
  'prevent_destroy',
  'ignore_changes',
  'replace_triggered_by',
  'precondition',
  'postcondition'
]);

interface ITerraformState {
  braceDepth: number;
  bracketDepth: number;
  parenDepth: number;
  inString: boolean;
  stringChar: string;
  inHeredoc: boolean;
  heredocEnd: string;
  inInterpolation: boolean;
  interpolationDepth: number;
  inBlockType: boolean;
  afterEquals: boolean;
}

export const terraformMode: StreamParser<ITerraformState> = {
  name: 'terraform',

  startState: (): ITerraformState => ({
    braceDepth: 0,
    bracketDepth: 0,
    parenDepth: 0,
    inString: false,
    stringChar: '',
    inHeredoc: false,
    heredocEnd: '',
    inInterpolation: false,
    interpolationDepth: 0,
    inBlockType: false,
    afterEquals: false
  }),

  token: (stream, state): string | null => {
    // Handle heredoc content
    if (state.inHeredoc) {
      if (stream.sol() && stream.match(new RegExp(`^\\s*${state.heredocEnd}\\s*$`))) {
        state.inHeredoc = false;
        state.heredocEnd = '';
        return 'string';
      }
      // Check for interpolation inside heredoc
      if (stream.match(/\$\{/, false)) {
        stream.match(/\$\{/);
        state.inInterpolation = true;
        state.interpolationDepth = 1;
        return 'keyword';
      }
      if (stream.match(/%\{/, false)) {
        stream.match(/%\{/);
        state.inInterpolation = true;
        state.interpolationDepth = 1;
        return 'keyword';
      }
      stream.next();
      return 'string';
    }

    // Handle interpolation
    if (state.inInterpolation) {
      if (stream.peek() === '{') {
        stream.next();
        state.interpolationDepth++;
        return null;
      }
      if (stream.peek() === '}') {
        stream.next();
        state.interpolationDepth--;
        if (state.interpolationDepth === 0) {
          state.inInterpolation = false;
        }
        return 'keyword';
      }
      // Continue with normal token parsing inside interpolation
    }

    // Handle string content
    if (state.inString) {
      // Check for interpolation start
      if (stream.match(/\$\{/, false)) {
        stream.match(/\$\{/);
        state.inInterpolation = true;
        state.interpolationDepth = 1;
        return 'keyword';
      }
      if (stream.match(/%\{/, false)) {
        stream.match(/%\{/);
        state.inInterpolation = true;
        state.interpolationDepth = 1;
        return 'keyword';
      }

      // Check for escape sequences
      if (stream.match(/\\./)) {
        return 'string.special';
      }

      // Check for end of string
      if (stream.peek() === state.stringChar) {
        stream.next();
        state.inString = false;
        state.stringChar = '';
        return 'string';
      }

      stream.next();
      return 'string';
    }

    // Skip whitespace
    if (stream.eatSpace()) {
      return null;
    }

    const ch = stream.peek();

    // Comments
    if (ch === '#') {
      stream.skipToEnd();
      return 'comment';
    }
    if (stream.match(/^\/\//)) {
      stream.skipToEnd();
      return 'comment';
    }
    if (stream.match(/^\/\*/)) {
      while (!stream.eol()) {
        if (stream.match(/\*\//)) {
          return 'comment';
        }
        stream.next();
      }
      return 'comment';
    }

    // Heredoc start
    if (stream.match(/<<-?([A-Z_][A-Z0-9_]*)/i)) {
      const match = stream.current().match(/<<-?([A-Z_][A-Z0-9_]*)/i);
      if (match) {
        state.inHeredoc = true;
        state.heredocEnd = match[1];
      }
      return 'string';
    }

    // Strings
    if (ch === '"') {
      stream.next();
      state.inString = true;
      state.stringChar = '"';
      return 'string';
    }

    // Numbers
    if (stream.match(/^-?0x[0-9a-fA-F]+/) || stream.match(/^-?\d+\.?\d*([eE][+-]?\d+)?/)) {
      return 'number';
    }

    // Operators
    if (stream.match(/^(==|!=|<=|>=|&&|\|\||!|<|>)/)) {
      return 'operator';
    }
    if (stream.match(/^[+\-*/%]/)) {
      return 'operator';
    }
    if (stream.match(/^=/)) {
      state.afterEquals = true;
      return 'operator';
    }

    // Interpolation markers
    if (stream.match(/^\$\{/)) {
      state.inInterpolation = true;
      state.interpolationDepth = 1;
      return 'keyword';
    }
    if (stream.match(/^%\{/)) {
      state.inInterpolation = true;
      state.interpolationDepth = 1;
      return 'keyword';
    }

    // Brackets and braces
    if (ch === '{') {
      stream.next();
      state.braceDepth++;
      state.inBlockType = false;
      return 'bracket';
    }
    if (ch === '}') {
      stream.next();
      state.braceDepth--;
      if (state.inInterpolation) {
        state.interpolationDepth--;
        if (state.interpolationDepth === 0) {
          state.inInterpolation = false;
        }
        return 'keyword';
      }
      return 'bracket';
    }
    if (ch === '[') {
      stream.next();
      state.bracketDepth++;
      return 'bracket';
    }
    if (ch === ']') {
      stream.next();
      state.bracketDepth--;
      return 'bracket';
    }
    if (ch === '(') {
      stream.next();
      state.parenDepth++;
      return 'bracket';
    }
    if (ch === ')') {
      stream.next();
      state.parenDepth--;
      return 'bracket';
    }

    // Punctuation
    if (stream.match(/^[.,;:?]/)) {
      return 'punctuation';
    }

    // Arrow operator
    if (stream.match(/^=>/)) {
      return 'operator';
    }

    // Splat operator
    if (stream.match(/^\.\.\./)) {
      return 'operator';
    }

    // Attribute access
    if (stream.match(/^\.[a-zA-Z_][a-zA-Z0-9_-]*/)) {
      return 'property';
    }

    // Identifiers
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_-]*/)) {
      const word = stream.current();

      // Check for block types at start of line (after whitespace)
      if (state.braceDepth === 0 || state.inBlockType) {
        if (BLOCK_TYPES.has(word)) {
          state.inBlockType = true;
          return 'keyword';
        }
      }

      // Check for for/if/in in expressions
      if (word === 'for' || word === 'if' || word === 'in' || word === 'else') {
        return 'keyword';
      }

      // Check for built-in functions (followed by parenthesis)
      if (BUILTIN_FUNCTIONS.has(word) && stream.peek() === '(') {
        return 'variableName.special';
      }

      // Check for type keywords
      if (TYPE_KEYWORDS.has(word)) {
        return 'typeName';
      }

      // Check for constants
      if (CONSTANTS.has(word)) {
        return 'atom';
      }

      // Check for common attributes
      if (COMMON_ATTRIBUTES.has(word)) {
        return 'attributeName';
      }

      // Check if this is a label (string after block type)
      if (state.inBlockType) {
        return 'string';
      }

      // Reference to variable/local/data/module
      if (
        word === 'var' ||
        word === 'local' ||
        word === 'each' ||
        word === 'self' ||
        word === 'path'
      ) {
        return 'variableName.special';
      }

      // Default to variable name
      state.afterEquals = false;
      return 'variableName';
    }

    // Consume any other character
    stream.next();
    return null;
  }
};
