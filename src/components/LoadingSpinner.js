import React from 'react';
import classNames from 'classnames';

import stylesheet from './LoadingSpinner.css';

const LoadingSpinner = ({ isLoading }) => {
  const classList = classNames(stylesheet.loadingSpinner, {
    [stylesheet.isVisible]: isLoading,
  });

  return <div className={classList} />;
};

LoadingSpinner.propTypes = {
  isLoading: React.PropTypes.bool,
};

export default LoadingSpinner;
