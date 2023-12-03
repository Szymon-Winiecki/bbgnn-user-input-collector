import { timestampToTimeString } from "../util/formatingUtils";
import Toast from "./toast";

export default function ToastSection({ toasts, maxToasts = 5, OnCloseClick }) {
  
  function limitToasts(toasts){
    if(toasts.length <= maxToasts) return toasts;

    return toasts.slice(toasts.length - maxToasts, toasts.length)
  }

  if(!toasts){
    return ( <div className="toast-container position-fixed bottom-0 end-0 p-3"></div>);
  }
  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3 pb-5">
      {limitToasts(toasts).map( (toast, id) => {
        return <Toast title={toast.title} body={toast.body} status={toast.status} when={timestampToTimeString(toast.time)} key={toast.time} OnCloseClick={(event) => OnCloseClick(event, id)} />
      })}
    </div>
  );
}