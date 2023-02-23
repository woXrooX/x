"use strict";

export default function content(){
  let dom = `
<container>
  <row>
    <column class="w-75 bc-3 radius p-5 bs">
      <form>

      <label>
          <p for='username'>Number</p>
          <input type='number' name='number'>
      </label>

        <label>
            <p for='username'>Username</p>
            <input type='text' name='username'>
        </label>

        <label>
            <p for='password'>Password</p>
            <input type='password' name='password'>
        </label>

        <label>
            <p for='password'>E-Mail</p>
            <input type='eMail' name='email'>
        </label>

        <label>
          <p for='logIn'>Checkbox</p>
          <input type='checkbox' name='checkbox' checked>
        </label>

        <fieldset for='gender'>

          <legend>Radio</legend>

          <label>
            <input type="radio" name="gender" value="male">
            Male
          </label>

          <label>
            <input type="radio" name="gender" value="female">
            Female
          </label>

        </fieldset>

        <label>
            <p for='logIn'>Color</p>
            <input type='color' name='color'>
        </label>

        <label>
          <p for='language'>Select</p>
          <select name="language">
            <option selected disabled>Choose</option>
            <option value="v1">V1</option>
            <option value="v2">V2</option>
            <option value="v3">V3</option>
          </select>
        </label>

        <label>
            <p for='logIn'>Textarea</p>
            <textarea rows="10"></textarea>
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

<container class="bc-5 radius">

  <row><h1>Table</h1></row>
  <row>

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
  </row>

</container>

<br>

<container class="bc-5 radius">
  <row><h1>.bc-x</h1></row>
  <row>
    <div class="bc-1 p-5">bc-1</div>
    <div class="bc-2 p-5">bc-2</div>
    <div class="bc-3 p-5">bc-3</div>
    <div class="bc-4 p-5">bc-4</div>
    <div class="bc-5 p-5">bc-5</div>
    <div class="bc-6 p-5">bc-6</div>
    <div class="bc-7 p-5">bc-6</div>
    <div class="bc-8 p-5">bc-6</div>
    <div class="bc-9 p-5">bc-6</div>
    <div class="bc-10 p-5">bc-6</div>
  </row>

</container>
  `;


  return dom;

}
