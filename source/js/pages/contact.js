"use strict";

export default function content(){
  let dom = `
<section style="padding: 10px 150px;">
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
        <p for='logIn'></p>
        <input type='submit' name='submit' value='Submit'>
    </label>

    <button type='submit' name='button'>Button</button>

  </form>

</section>
  `;


  return dom;

}
