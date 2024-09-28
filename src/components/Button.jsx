import styles from './Button.module.css'

const Button = ({ children, onclick, type }) => {
  return <button className={`${styles.btn} ${styles[type]}`} onClick={onclick}>{children}</button>;
};
export default Button;
