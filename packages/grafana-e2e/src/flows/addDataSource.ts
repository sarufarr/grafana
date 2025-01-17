import { e2e } from '../index';

export const addDataSource = (pluginName?: string): string => {
  pluginName = pluginName || 'TestData DB';

  e2e.pages.DataSources.visit();
  e2e.pages.DataSources.addDataSource().click();

  e2e.pages.AddDataSource.dataSourcePlugins(pluginName).click();

  const dataSourceName = `e2e-${new Date().getTime()}`;
  e2e.pages.DataSource.name().clear();
  e2e.pages.DataSource.name().type(dataSourceName);
  e2e.pages.DataSource.saveAndTest().click();
  e2e.pages.DataSource.alert().should('exist');
  e2e.pages.DataSource.alertMessage().should('contain.text', 'Data source is working');

  return dataSourceName;
};
