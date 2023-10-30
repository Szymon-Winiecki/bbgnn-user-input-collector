import { useRef } from "react";

export default function NavigationTabs({ tabs, selectedTab, OnChangeTab }) {

    const lastClicked = useRef(selectedTab)

    function handleTabClick(id){
        if(parseInt(id) != lastClicked.current){
            lastClicked.current = parseInt(id);
            OnChangeTab(lastClicked.current);
        }
    }

  return (
    <ul className="nav nav-tabs">
        {tabs.map( (tab, id) => {
            return <li className="nav-item" key={id} onClick={() => {handleTabClick(id)}}>
                        <a className={`nav-link ${id == selectedTab ? "active" : ""}`}>{tab.name}</a>
                    </li>;
        })}
    </ul>
  );
}