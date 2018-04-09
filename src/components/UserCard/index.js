import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './index.scss';

const UserCard = ({ username, cardValue, className }) => (
  <div className={cx('UserCard text-center d-inline-block', className)}>
    <div className="UserCard__header">{username}</div>
    <div className="py-5">
      <div className="UserCard__count">{cardValue}</div>
    </div>
  </div>
);

UserCard.propTypes = {
  username: PropTypes.string,
  cardValue: PropTypes.node,
  className: PropTypes.string,
};

UserCard.defaultProps = {
  username: 'noName',
  cardValue: undefined,
  className: undefined,
};

export default UserCard;
