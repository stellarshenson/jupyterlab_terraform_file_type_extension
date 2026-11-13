import { StringStream } from '@codemirror/language';
import plugin, { terraformIcon } from '../index';
import { terraformMode } from '../terraform-mode';

// The lab packages pull in ES modules Jest does not transform; these tests need none of them
jest.mock('@jupyterlab/ui-components', () => ({ LabIcon: class {} }));
jest.mock('@jupyterlab/codemirror', () => ({ IEditorLanguageRegistry: {} }));

/** Run the parser over the text; adjacent tokens of one style are merged per line. */
function tokenize(text: string) {
  const state = terraformMode.startState!(2);
  const tokens: [string, string | null][] = [];
  for (const line of text.split('\n')) {
    const stream = new StringStream(line, 2, 2);
    let last: [string, string | null] | undefined;
    while (!stream.eol()) {
      stream.start = stream.pos;
      const style = terraformMode.token(stream, state);
      if (last && last[1] === style) {
        last[0] += stream.current();
      } else {
        last = [stream.current(), style];
        tokens.push(last);
      }
    }
  }
  return { tokens, state };
}

describe('terraform highlighting', () => {
  it('marks a block type as a keyword', () => {
    const { tokens } = tokenize('resource "aws_instance" "web" {');
    expect(tokens[0]).toEqual(['resource', 'keyword']);
  });

  it('marks a built-in function', () => {
    const { tokens } = tokenize('x = max(1, 2)');
    expect(tokens).toContainEqual(['max', 'variableName.special']);
  });

  it('marks ${} and %{} inside a string', () => {
    const { tokens, state } = tokenize('a = "x-${var.y}-%{ if z }q%{ endif }"');
    expect(tokens).toContainEqual(['${', 'keyword']);
    expect(tokens).toContainEqual(['%{', 'keyword']);
    expect(state.inInterpolation).toBe(false);
    expect(state.inString).toBe(false);
  });

  it('marks an escape sequence', () => {
    const { tokens } = tokenize('a = "x\\n"');
    expect(tokens).toContainEqual(['\\n', 'string.special']);
  });

  it('closes an interpolation inside a heredoc', () => {
    const { tokens, state } = tokenize(
      [
        'resource "a" "b" {',
        '  user_data = <<-EOT',
        '    echo ${var.name}',
        '  EOT',
        '}',
        'resource "c" "d" {'
      ].join('\n')
    );
    expect(tokens).toContainEqual(['    echo ', 'string']);
    expect(state.inHeredoc).toBe(false);
    expect(state.inInterpolation).toBe(false);
    expect(state.braceDepth).toBe(1);
    expect(tokens.filter(t => t[0] === 'resource')).toEqual([
      ['resource', 'keyword'],
      ['resource', 'keyword']
    ]);
  });

  it('marks type keywords, constants and operators', () => {
    const { tokens } = tokenize('a = string\nb = true\nc = 1 == 2');
    expect(tokens).toContainEqual(['string', 'typeName']);
    expect(tokens).toContainEqual(['true', 'atom']);
    expect(tokens).toContainEqual(['==', 'operator']);
  });

  it('marks #, // and multi-line /* */ comments', () => {
    const { tokens } = tokenize(
      ['# one', '// two', '/* three', 'resource "x" "y" {', '*/ locals {'].join(
        '\n'
      )
    );
    expect(tokens.slice(0, 5)).toEqual([
      ['# one', 'comment'],
      ['// two', 'comment'],
      ['/* three', 'comment'],
      ['resource "x" "y" {', 'comment'],
      ['*/', 'comment']
    ]);
    expect(tokens).toContainEqual(['locals', 'keyword']);
  });
});

describe('file recognition', () => {
  const fileTypes: any[] = [];
  const languages: any[] = [];
  plugin.activate(
    { docRegistry: { addFileType: (t: any) => fileTypes.push(t) } } as any,
    { addLanguage: (l: any) => languages.push(l) } as any
  );
  const typeOf = (name: string) =>
    fileTypes.find(t => new RegExp(t.pattern).test(name))?.name;
  const languageOf = (name: string) =>
    languages.find(l => l.filename.test(name))?.name;

  it('recognises Terraform files', () => {
    expect(typeOf('main.tf')).toBe('terraform');
    expect(typeOf('prod.tfvars')).toBe('terraform-vars');
    expect(languageOf('main.tf')).toBe('terraform');
    expect(languageOf('prod.tfvars')).toBe('terraform');
  });

  it('recognises Terraform state files', () => {
    expect(typeOf('terraform.tfstate')).toBe('terraform-state');
    expect(typeOf('terraform.tfstate.backup')).toBe('terraform-state');
  });

  it('recognises HCL files', () => {
    for (const name of [
      'a.hcl',
      'a.tfstack.hcl',
      'a.tfcomponent.hcl',
      'a.tfdeploy.hcl',
      'a.tftest.hcl',
      'a.tfmock.hcl',
      'a.tfquery.hcl'
    ]) {
      expect(typeOf(name)).toBe('hcl');
      expect(languageOf(name)).toBe('hcl');
    }
    expect(typeOf('notes.txt')).toBeUndefined();
  });

  it('gives every file type the Terraform icon', () => {
    expect(fileTypes).toHaveLength(4);
    for (const t of fileTypes) {
      expect(t.icon).toBe(terraformIcon);
    }
  });
});
