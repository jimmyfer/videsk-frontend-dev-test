import "./components/component";
import html from "./index.html";
import css from "./main.css";

document.body.innerHTML = `
            <style>${css.toString()}</style>
            ${html}
        `;
