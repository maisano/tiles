import React from 'react';
import classNames from 'classnames';

import stylesheet from './OptionGroup.css';

class OptionGroup extends React.Component {
  constructor(props) {
    super(props);

    this.renderOption = this.renderOption.bind(this);
  }

  renderOption({ label, value }) {
    const classList = classNames(stylesheet.option, {
      [stylesheet.isSelected]: value === this.props.value,
    });

    return (
      <div
        key={label}
        className={classList}
        onClick={() => this.props.onChange(value)}
      >
        {label}
      </div>
    );
  }

  render() {
    return (
      <div className={stylesheet.container}>
        {this.props.options.map(this.renderOption)}
      </div>
    );
  }
}

OptionGroup.propTypes = {
  options: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      label: React.PropTypes.string,
      value: React.PropTypes.any,
    })
  ),
  value: React.PropTypes.any,
  onChange: React.PropTypes.func,
};

export default OptionGroup;
