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
    <column class="w-75">C1</column>
    <column class="w-25">C2</column>
  </row>
  <row>
    <column class="w-100">C1</column>
    <column class="w-5">C2</column>
  </row>
</container>
  `;


  return data2;

}
