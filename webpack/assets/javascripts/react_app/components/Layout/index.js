import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
  initializeLayout,
  collapseLayoutMenus,
  expandLayoutMenus,
} from './LayoutActions';
import reducer from './LayoutReducer';
import {
  patternflyMenuItemsSelector,
  selectIsLoading,
  selectIsCollapsed,
} from './LayoutSelectors';
import { combineMenuItems } from './LayoutHelper';
import { getIsNavbarCollapsed } from './LayoutSessionStorage';
import {
  useForemanOrganization,
  useForemanLocation,
} from '../../Root/Context/ForemanContext';

import Layout from './Layout';

const ConnectedLayout = ({ children, data }) => {
  const dispatch = useDispatch();

  const currentLocation = useForemanLocation()?.title;
  const currentOrganization = useForemanOrganization()?.title;
  useEffect(() => {
    dispatch(
      initializeLayout({
        items: combineMenuItems(data),
        isCollapsed: getIsNavbarCollapsed(),
        organization: data.orgs.current_org,
        location: data.locations.current_location,
      })
    );
  }, [data, dispatch]);

  const isNavCollapsed = useSelector(state => selectIsCollapsed(state));
  useEffect(() => {
    // toggles a class in the body tag, so that the main #rails-app-content container can have the appropriate width
    if (isNavCollapsed) {
      document.body.classList.remove('pf-m-expanded');
    } else {
      document.body.classList.add('pf-m-expanded');
    }
  }, [isNavCollapsed]);
  const { push: navigate } = useHistory();
  const items = useSelector(state =>
    patternflyMenuItemsSelector(state, currentLocation, currentOrganization)
  );
  const isLoading = useSelector(state => selectIsLoading(state));
  const isCollapsed = useSelector(state => selectIsCollapsed(state));

  const [navigationActiveItem, setNavigationActiveItem] = useState(null);

  return (
    <Layout
      data={data}
      navigate={navigate}
      items={items}
      isLoading={isLoading}
      isCollapsed={isCollapsed}
      collapseLayoutMenus={() => {
        setNavigationActiveItem(null);
        dispatch(collapseLayoutMenus());
      }}
      expandLayoutMenus={() => dispatch(expandLayoutMenus())}
      navigationActiveItem={navigationActiveItem}
      setNavigationActiveItem={setNavigationActiveItem}
    >
      {children}
    </Layout>
  );
};

// export prop-types
export const { propTypes, defaultProps } = Layout;

ConnectedLayout.propTypes = {
  children: propTypes.children,
  data: propTypes.data,
};

ConnectedLayout.defaultProps = {
  children: defaultProps.children,
  data: defaultProps.data,
};

// export reducers
export const reducers = { layout: reducer };

// export connected component
export default ConnectedLayout;
