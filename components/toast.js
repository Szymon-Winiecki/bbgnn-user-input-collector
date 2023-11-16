import styles from './toast.module.css';

export default function Toast({ title, body, when, status, OnCloseClick }) {
  return (
    <div className="toast show mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="toast-header">
        <div className={`${styles.statusBox} bg-${status ? status : 'info'} rounded me-2`} />
        <strong className="me-auto">{title}</strong>
        <small>{ when }</small>
        <button type="button" className="btn-close" aria-label="Close" onClick={OnCloseClick}></button>
      </div>
      <div className="toast-body">
        { body }
      </div>
    </div>
  );
}