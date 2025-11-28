# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## 1.0.3

### Terraform State File Support

- Added `*.tfstate.*` file type registration with Terraform icon
- State files use native JSON highlighting (preserving JSON syntax support)

### README Refinements

- Added self-deprecating humor about mass-produced file type extensions
- Added attribution to hashicorp/vscode-terraform for syntax inspiration
- Added screenshot reference before features section

## 1.0.2

### Syntax Highlighting Fix

- Added `filename` regex pattern to `languages.addLanguage()` calls
- Added `pattern` property to file type registrations
- Critical fix enabling proper file-to-language matching for syntax highlighting

## 1.0.1

### Terraform Syntax Implementation

- Implemented comprehensive HCL/Terraform syntax highlighting
- Block types: `resource`, `module`, `provider`, `variable`, `output`, `locals`, `data`, `terraform`, and more
- 100+ built-in Terraform functions with syntax highlighting
- Type keywords, constants, and common attributes
- Heredoc string support with escape sequences
- String interpolation with `${}` and `%{}` directives
- All comment styles: `#`, `//`, `/* */`
- Operators and expression syntax

### File Type Registration

- Terraform: `*.tf`, `*.tfvars`
- HCL: `*.hcl`, `*.tfstack.hcl`, `*.tfcomponent.hcl`, `*.tfdeploy.hcl`, `*.tftest.hcl`, `*.tfmock.hcl`, `*.tfquery.hcl`
- Purple HashiCorp Terraform icon in file browser

## 1.0.0

### Initial Release

- JupyterLab 4 extension scaffolding
- Standard extension structure with TypeScript source
- GitHub Actions CI/CD workflows
- README with badges and documentation

<!-- <END NEW CHANGELOG ENTRY> -->
