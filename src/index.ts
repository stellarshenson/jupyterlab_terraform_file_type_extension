import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IEditorLanguageRegistry } from '@jupyterlab/codemirror';
import { LabIcon } from '@jupyterlab/ui-components';
import { StreamLanguage, LanguageSupport } from '@codemirror/language';
import { terraformMode } from './terraform-mode';

// Terraform icon - HashiCorp Terraform logo
const terraformIconStr =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><g fill="#7b42bc"><path d="M44.5 0L77.2 18.9V56.7L44.5 37.8V0z"/><path d="M83.4 21.3v37.8l32.7-18.9V2.4L83.4 21.3z"/><path d="M11.9 40.2L44.6 59.1V96.9L11.9 78V40.2z"/><path d="M44.5 63l32.7 18.9v37.8L44.5 100.8V63z"/></g></svg>';

export const terraformIcon = new LabIcon({
  name: 'terraform:icon',
  svgstr: terraformIconStr
});

/**
 * Initialization data for the jupyterlab_terraform_file_type_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_terraform_file_type_extension:plugin',
  description:
    'JupyterLab extension to support syntax highlighting for Terraform files',
  autoStart: true,
  requires: [IEditorLanguageRegistry],
  activate: (app: JupyterFrontEnd, languages: IEditorLanguageRegistry) => {
    console.log(
      '[jupyterlab_terraform_file_type_extension] Extension activated!'
    );

    // Register Terraform language support for .tf and .tfvars files
    languages.addLanguage({
      name: 'terraform',
      displayName: 'Terraform',
      mime: 'text/x-terraform',
      extensions: ['.tf', '.tfvars'],
      support: new LanguageSupport(StreamLanguage.define(terraformMode))
    });

    // Register HCL language support for other HashiCorp configuration files
    languages.addLanguage({
      name: 'hcl',
      displayName: 'HCL',
      mime: 'text/x-hcl',
      extensions: [
        '.hcl',
        '.tfstack.hcl',
        '.tfcomponent.hcl',
        '.tfdeploy.hcl',
        '.tftest.hcl',
        '.tfmock.hcl',
        '.tfquery.hcl'
      ],
      support: new LanguageSupport(StreamLanguage.define(terraformMode))
    });

    // Register file type for Terraform configuration files (.tf)
    app.docRegistry.addFileType({
      name: 'terraform',
      displayName: 'Terraform',
      mimeTypes: ['text/x-terraform'],
      extensions: ['.tf'],
      fileFormat: 'text' as const,
      contentType: 'file' as const,
      icon: terraformIcon
    });

    // Register file type for Terraform variables files (.tfvars)
    app.docRegistry.addFileType({
      name: 'terraform-vars',
      displayName: 'Terraform Variables',
      mimeTypes: ['text/x-terraform'],
      extensions: ['.tfvars'],
      fileFormat: 'text' as const,
      contentType: 'file' as const,
      icon: terraformIcon
    });

    // Register file type for HCL configuration files
    app.docRegistry.addFileType({
      name: 'hcl',
      displayName: 'HCL',
      mimeTypes: ['text/x-hcl'],
      extensions: [
        '.hcl',
        '.tfstack.hcl',
        '.tfcomponent.hcl',
        '.tfdeploy.hcl',
        '.tftest.hcl',
        '.tfmock.hcl',
        '.tfquery.hcl'
      ],
      fileFormat: 'text' as const,
      contentType: 'file' as const,
      icon: terraformIcon
    });
  }
};

export default plugin;
