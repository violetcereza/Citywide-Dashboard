'use strict';

describe('CwdApp', () => {
  let React = require('react/addons');
  let CwdApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    CwdApp = require('components/CwdApp.js');
    component = React.createElement(CwdApp);
  });

  it('should create a new instance of CwdApp', () => {
    expect(component).toBeDefined();
  });
});
