"use strict";

export const TITLE = "Home";
export default function home(){



  let data = `
<section class="w-half h-full">
  <form for="home">
    <input type="text" name="username" placeholder="Username">
    <input type="password" name="password" placeholder="Password">
    <input type="submit" name="logIn" value="Log In">
  </form>
</section>

  `;

  let data2 = `
<container>
  <row>
    <column class="wd-25">C1</column>
    <column class="wd-75">C2</column>
  </row>
  <row>
    <column class="wd-100">C1</column>
    <column class="wd-5">C2</column>
  </row>
</container>
  `;


  return data2;

}
