import styles from "./style.module.css";

const Notification = ({ message , type }) => {
  return <div className={`${styles.notification} ${styles[type]}`}>{message}</div>;
};

export default Notification;
