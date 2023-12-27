"use strict";
export const TITLE = window.Lang.use("root");

export default function content(){
  return `
    <container class="root pt-5">
      <section>
        <form action="/root" for="sanitizeUsersFolders"><input class="btn btn-primary" type="submit" value="sanitize users folders"></form>
      </section>
    </container>
  `;
}
