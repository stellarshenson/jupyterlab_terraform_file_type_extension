import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_terraform_file_type_extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_terraform_file_type_extension:plugin',
  description: 'Jupyterlab extension to support syntax highlighting for terraform files',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_terraform_file_type_extension is activated!');
  }
};

export default plugin;
