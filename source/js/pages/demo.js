"use strict";

///// toast
setTimeout(()=>{window.Toast.new("success", "success");}, 1000);
setTimeout(()=>{window.Toast.new("info", "info");}, 2000);
setTimeout(()=>{window.Toast.new("warning", "warning");}, 3000);
setTimeout(()=>{window.Toast.new("error", "error");}, 4000);


///// Form
const form = `
<container>

  <row><h1>Form</h1></row>

  <row>

    <column class="w-75 bc-3 radius p-5 bs">

      <form>

        <label>
            <p for='number'>Number</p>
            <input type='number' name='number'>
        </label>

        <label>
            <p for='text'>Text</p>
            <input type='text' name='text'>
        </label>

        <label>
            <p for='password'>Password</p>
            <input type='password' name='password'>
        </label>

        <label>
            <p for='eMail'>eMail</p>
            <input type='eMail' name='eMail'>
        </label>

        <label>
          <p for='checkbox'>Checkbox</p>
          <input type='checkbox' name='checkbox' checked>
        </label>

        <fieldset for='radio'>

          <legend>Radio</legend>

          <label>
            <input type="radio" name="radio" value="first">
            First
          </label>

          <label>
            <input type="radio" name="radio" value="second">
            Second
          </label>

        </fieldset>

        <label>
            <p for='color'>Color</p>
            <input type='color' name='color'>
        </label>

        <label>
            <p for='file'>File</p>
            <input type='file' name='file'>
        </label>

        <label>
          <p for='select'>Select</p>
          <select name="select">
            <option selected disabled>Choose</option>
            <option value="v1">V1</option>
            <option value="v2">V2</option>
            <option value="v3">V3</option>
          </select>
        </label>

        <label>
            <p for='textarea'>Textarea</p>
            <textarea name="textarea" rows="5"></textarea>
        </label>

        <label>
            <p for='submit'></p>
            <input type='submit' name='submit' value='Submit'>
        </label>

        <label>
            <p for='button'></p>
            <button type='submit' name='button'>Button</button>
        </label>

      </form>

    </column>

  </row>

</container>
`;


///// Table
const table = `
<container>

  <row><h1>Table</h1></row>

  <row>

    <column class="w-75 bc-5 radius">

      <table>

        <thead>
          <tr>
            <th>Header content 1</th>
            <th>Header content 2</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Body content 1</td>
            <td>Body content 2</td>
          </tr>

          <tr>
            <td>Body content 3</td>
            <td>Body content 4</td>
          </tr>

          <tr>
            <td>Body content 5</td>
            <td>Body content 6</td>
          </tr>

          <tr>
            <td>Body content 7</td>
            <td>Body content 8</td>
          </tr>

        </tbody>

        <tfoot>
          <tr>
            <td>Footer content 1</td>
            <td>Footer content 2</td>
          </tr>
        </tfoot>

      </table>

    </column>

  </row>

</container>
`;


///// Class .bc-x & --color-surface-x
const classBCcolorSurfaceX = `
<container>

  <row><h1>.bc-x (--color-surface-x)</h1></row>

  <row class="bc-5 radius p-5">

    <div class="bc-1 p-2">.bc-1 <br> --color-surface-1</div>
    <div class="bc-2 p-2">.bc-2 <br> --color-surface-2</div>
    <div class="bc-3 p-2">.bc-3 <br> --color-surface-3</div>
    <div class="bc-4 p-2">.bc-4 <br> --color-surface-4</div>
    <div class="bc-5 p-2">.bc-5 <br> --color-surface-5</div>
    <div class="bc-6 p-2">.bc-6 <br> --color-surface-6</div>
    <div class="bc-7 p-2">.bc-7 <br> --color-surface-7</div>
    <div class="bc-8 p-2">.bc-8 <br> --color-surface-8</div>
    <div class="bc-9 p-2">.bc-9 <br> --color-surface-9</div>
    <div class="bc-10 p-2">.bc-10 <br> --color-surface-10</div>

  </row>

</container>
`;


///// --color-text-x
const colorTextX = `
<container>

  <row><h1>--color-text-x</h1></row>

  <row class="bc-3 radius p-5">

    <div style="color:var(--color-text-primary)" class="bc-1 p-5">
      <b>--color-text-primary</b>
    </div>

    <div style="color:var(--color-text-secondary)" class="bc-5 p-5">
      <b>--color-text-secondary</b>
    </div>

    <div style="color:var(--color-text-accent)"  class="bc-10 p-5">
      <b>--color-text-accent</b>
    </div>

  </row>

</container>
`;


export default function content(){
  let dom = `
    ${form}
    ${table}
    ${classBCcolorSurfaceX}
    ${colorTextX}
  `;

  return dom;

}
