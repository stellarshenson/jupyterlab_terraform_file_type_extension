# Acceptance Criteria - jupyterlab_terraform_file_type_extension

Terraform and HCL file types, icon and syntax highlighting in JupyterLab.

## Authors

- `@kj` Konrad Jelen

## File recognition `FILE`

Which files get a Terraform or HCL file type, language and icon

- log: 2026-11-13T09:19:44Z @kj category created

- [x] `ACC-FILE-1-TF` **Terraform files** - HIGH; *.tf and *.tfvars get the Terraform file type and Terraform highlighting
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: file recognition, recognises Terraform files
  - test-tags: UNIT
  - log: 2026-11-13T09:19:44Z @kj added
  - log: 2026-11-13T09:22:09Z @kj closed
- [x] `ACC-FILE-2-STATE` **Terraform state files** - MEDIUM; *.tfstate and _.tfstate._ get the Terraform State file type
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: file recognition, recognises Terraform state files
  - test-tags: UNIT
  - log: 2026-11-13T09:19:44Z @kj added
  - log: 2026-11-13T09:22:09Z @kj closed
- [x] `ACC-FILE-3-HCL` **HCL files** - HIGH; *.hcl, including the tfstack, tfcomponent, tfdeploy, tftest, tfmock and tfquery variants, get the HCL file type and highlighting
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: file recognition, recognises HCL files
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:09Z @kj closed
- [x] `ACC-FILE-4-ICON` **Terraform icon** - MEDIUM; all four file types carry the purple Terraform icon
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: file recognition, gives every file type the Terraform icon
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:09Z @kj closed

## Highlighting `HIGHL`

Token types the stream parser gives to Terraform and HCL text

- log: 2026-11-13T09:19:45Z @kj category created

- [x] `ACC-HIGHL-5-BLOCKS` **Block types** - HIGH; a block type such as resource, module or variable at top level is a keyword
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: terraform highlighting, marks a block type as a keyword
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:09Z @kj closed
- [x] `ACC-HIGHL-6-FUNCTIONS` **Built-in functions** - MEDIUM; a built-in function name followed by ( is marked as a function
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: terraform highlighting, marks a built-in function
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:10Z @kj closed
- [x] `ACC-HIGHL-7-INTERPOLATION` **String interpolation** - HIGH; ${ and %{ and their closing brace inside a string are keywords, and the string ends after them
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: terraform highlighting, marks ${} and %{} inside a string
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:10Z @kj closed
- [x] `ACC-HIGHL-8-HEREDOC` **Heredoc strings** - HIGH; heredoc text is a string, an interpolation inside it closes, and the code after the heredoc is highlighted as code
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: terraform highlighting, closes an interpolation inside a heredoc
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:10Z @kj closed
- [x] `ACC-HIGHL-9-ESCAPES` **Escape sequences** - LOW; a backslash escape inside a string is marked apart from the string
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: terraform highlighting, marks an escape sequence
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:10Z @kj closed
- [x] `ACC-HIGHL-10-TYPES` **Types, constants, operators** - MEDIUM; type keywords, true/false/null and comparison operators each get their own token type
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: terraform highlighting, marks type keywords, constants and operators
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:10Z @kj closed
- [x] `ACC-HIGHL-11-COMMENTS` **Comments** - HIGH; #, // and /* _/ comments are comments; a /_ */ comment spanning lines is a comment on every line
  - evidence: Jest 11 of 11 green in build_test.py at 1.0.10
  - test: Jest: terraform highlighting, marks #, // and multi-line /* */ comments
  - test-tags: UNIT
  - log: 2026-11-13T09:19:45Z @kj added
  - log: 2026-11-13T09:22:10Z @kj closed
