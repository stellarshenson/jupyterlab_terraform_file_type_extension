# Defects - jupyterlab_terraform_file_type_extension

Defects of the Terraform and HCL file types and of the stream parser that highlights them.

## Authors

- `@kj` Konrad Jelen

## Stream parser `PARSE`

Token and state errors of the Terraform stream parser in src/terraform-mode.ts

- log: 2026-11-13T09:20:03Z @kj category created

- [x] `DEF-PARSE-1-HEREDOC` **Highlighting wrong after a heredoc with an interpolation** - MEDIUM; after a heredoc holding ${...}, the closing } of the block is a keyword and every later top-level block type loses its keyword colour; cause: the heredoc branch returned before the interpolation branch, so the interpolation never closed; fix: interpolation branch moved before the heredoc branch; `src/terraform-mode.ts`
  - evidence: Jest 'closes an interpolation inside a heredoc' failed before the fix (braceDepth 2, expected 1), green after; Jest 11 of 11 green in build_test.py at 1.0.10
  - root-cause: 2026-11-13T09:22:10Z @kj the heredoc branch of token() returned before the interpolation branch, so inInterpolation set by ${ in a heredoc was never cleared until a } after the heredoc
  - repro: open a .tf with a resource whose user_data is a heredoc containing ${var.name}, then a second resource block
  - test-tags: UNIT
  - log: 2026-11-13T09:20:03Z @kj added
  - log: 2026-11-13T09:22:10Z @kj closed
- [x] `DEF-PARSE-2-UNTESTED` **Parser and file patterns had no test** - MINOR; the only Jest test asserted 1 + 1 = 2, so a break in the parser or in a file pattern passed CI; fix: 11 Jest tests over the token types and the file patterns; `src/__tests__/jupyterlab_terraform_file_type_extension.spec.ts`
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10; 2 of the 11 failed on the unfixed parser
  - root-cause: 2026-11-13T09:22:10Z @kj the spec was the template placeholder and was never replaced
  - repro: read the spec at 2eb3841
  - test-tags: UNIT
  - log: 2026-11-13T09:20:03Z @kj added
  - log: 2026-11-13T09:22:11Z @kj closed
- [-] `DEF-PARSE-3-DEAD-CODE` **Unreachable branches and unused state in the parser** - MINOR; the => , ... and .attribute branches never run because = and the punctuation match precede them; the inInterpolation branch under } never runs; afterEquals, bracketDepth and parenDepth are written and never read; package.json lists 3 packages src does not import; `src/terraform-mode.ts`
  - test-tags: MANUAL
  - repro: read src/terraform-mode.ts from the Punctuation comment down; grep src for legacy-modes, docregistry, fileeditor
  - log: 2026-11-13T09:20:03Z @kj added
  - log: 2026-11-13T09:20:24Z @kj edited test-tags added "MANUAL"
  - log: 2026-11-13T09:22:16Z @kj rejected: rejected: no user sees a difference; making the branches reachable would change token colours nobody asked to change; named here, not deleted
- [x] `DEF-PARSE-4-BLOCK-COMMENT` **Multi-line block comment highlighted as code** - MEDIUM; only the first line of a /* */ comment is a comment; later lines are highlighted as code and a brace in them shifts the brace depth; cause: the comment loop stopped at the line end and kept no state; fix: inComment state carries the comment to its */; `src/terraform-mode.ts`
  - evidence: Jest 'marks #, // and multi-line /* */ comments' failed before the fix (line 2 was keyword), green after; Jest 11 of 11 green in build_test.py at 1.0.10
  - root-cause: 2026-11-13T09:22:10Z @kj the /* branch looped to the line end and returned with no state, so the next line started as code
  - repro: open a .tf holding a /* */ comment that spans three lines
  - test-tags: UNIT
  - log: 2026-11-13T09:20:07Z @kj added
  - log: 2026-11-13T09:22:10Z @kj closed
