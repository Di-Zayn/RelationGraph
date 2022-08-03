import React from 'react';
import style from './style.css';

const Loader = ({ spinning = false, fullScreen }) => {
  return (
    <div className={style.loader}>
      {/* <div className={styles.warpper}>
        <div className={styles.inner} />
        <div className={styles.text}>LOADING</div>
      </div> */}
    </div>
  );
};

// Loader.propTypes = {
//   spinning: PropTypes.bool,
//   fullScreen: PropTypes.bool,
// }

export default Loader;
