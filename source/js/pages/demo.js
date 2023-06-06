"use strict";

///// toast
setTimeout(()=>{window.Toast.new("success", "success");}, 1000);
setTimeout(()=>{window.Toast.new("info", "info");}, 2000);
setTimeout(()=>{window.Toast.new("warning", "warning");}, 3000);
setTimeout(()=>{window.Toast.new("error", "error");}, 4000);


///// box-x
const themedBoxes = `
<container class="m-t-5 p-5">
  <row><h1>Themed Boxes (.box-x)</h1></row>
</container>

<container class="m-t-5 p-5">

  <row><h3>Default Box (.box-default)</h3></row>

  <row class="g-1">
    <column class="box-default w-25 p-5">box-default w-25 p-5"</column>
    <column class="box-default w-75 p-2">box-default w-75 p-2</column>
  </row>
</container>

<container class="m-t-5">

  <row><h3>2D Box (.box-2D)</h3></row>

  <row>
    <column class="box-2D w-25 p-5">box-2D w-25 p-5</column>
    <column class="box-2D w-35 p-2">box-2D w-35 p-2</column>
    <column class="box-2D w-40 p-4">box-2D w-40 p-4</column>
  </row>

  <row>
    <column class="box-2D w-45 p-5">box-2D w-45 p-5</column>
    <column class="box-2D w-55 p-2">box-2D w-55 p-2</column>
  </row>

</container>

<container class="m-t-5 p-5">

  <row><h3>Round Box (.box-round)</h3></row>

  <row class="g-1">
    <column class="box-round bc-4 w-25 p-2">box-round bc-4 w-25 p-2</column>
    <column class="box-round w-50 p-5">box-round w-50 p-5</column>
    <column class="box-round w-25 bc-5 p-1">box-round bc-5 w-25 p-1</column>
  </row>
</container>
`;


///// x-tooltip
const tooltips = `
<container class="m-t-5">

  <row><h1>Tooltips (x-tooltip)</h1></row>

  <row class="g-1">
    <column><x-tooltip type="success">success</x-tooltip></column>
    <column><x-tooltip type="info">info</x-tooltip></column>
    <column><x-tooltip type="warning">warning</x-tooltip></column>
    <column><x-tooltip type="error">error</x-tooltip></column>
  </row>

</container>
`;


///// x-tooltip
const copy = `
<container class="m-t-5">

  <row><h1>Copy (x-copy)</h1></row>

  <row class="box-default w-25 p-5" class="g-1">
    <column><x-copy selector="#dataToBeCopied"></x-copy></column>
    <column id="dataToBeCopied">Data To Be Copied!</column>
  </row>

</container>
`;


///// x-tooltip
const share = `
<container class="m-t-5">

  <row><h1>Share (x-share)</h1></row>

  <row class="box-default w-25 p-5" class="g-1">
    <column><x-share></x-share></column>
  </row>

</container>
`;


///// x-modal
const modal = `
<container class="m-t-5">

  <row><h1>Modal (x-modal)</h1></row>

  <row class="box-default w-25 p-5" class="g-1">
    <x-modal trigger="auto">Auto</x-modal>

    <x-modal trigger="click" type="icon" value="idea">Icon + Click</x-modal>
    <x-modal trigger="click" type="text" value="Click Me">Text + Click</x-modal>

    <x-modal trigger="click" button type="icon" value="idea">Button + Icon + Click</x-modal>
    <x-modal trigger="click" button type="text" value="Click Me">Button + Text + Click</x-modal>

  </row>

</container>
`;


///// Fonts
const fonts = `
<container class="m-t-5">

  <row><h1>Fonts</h1></row>

  <row>
    <column>
      <p>System Default Font Family: <b>Quicksand</b></p>
      <p>All Fonts Listed Here Are <b>Regular</b></p>
    </column>
  </row>

  <row>

    <column class="w-75 box-default p-5 m-t-5">

      <table>

        <thead>
          <tr>
            <th>Name</th>
            <th>Sample</th>
          </tr>
        </thead>

        <tbody style="font-size: 1.3rem;">

          <tr>
            <td>Quicksand</td>
            <td><span style="font-family: Quicksand;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>AlegreyaSans</td>
            <td><span style="font-family: AlegreyaSans;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>Cardo</td>
            <td><span style="font-family: Cardo;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>Cinzel</td>
            <td><span style="font-family: Cinzel;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>Eczar</td>
            <td><span style="font-family: Eczar;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>Gruppo</td>
            <td><span style="font-family: Gruppo;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>JosefinSans</td>
            <td><span style="font-family: JosefinSans;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>JosefinSlab</td>
            <td><span style="font-family: JosefinSlab;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>Macondo</td>
            <td><span style="font-family: Macondo;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>Philosopher</td>
            <td><span style="font-family: Philosopher;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>Marcellus</td>
            <td><span style="font-family: Marcellus;">When Creativity Meets Technology<span></td>
          </tr>

          <tr>
            <td>SpecialElite</td>
            <td><span style="font-family: SpecialElite;">When Creativity Meets Technology<span></td>
          </tr>

        </tbody>

      </table>

    </column>

  </row>

</container>
`;


///// Page Scoped Data Holder
// Must Be Set/Change The Value Inside The before(), content() or after()
window.pageData = "No Effect Here";

///// Before
// Will Be Executed Before content() Has Been Rendered
// Can Be Set Async
export function before(){
  window.pageData = "Updated @ Function before()";
  console.log("BEFORE: ", window.pageData);

}

// Title
export const TITLE = window.Lang.use("demo");

///// Content
// Can Be Set Async
export default function content(){
  let dom = `
    ${situationalColors}
    ${themedBoxes}
    ${tooltips}
    ${copy}
    ${share}
    ${modal}
    ${fonts}
    <br>
  `;

  return dom;

}

///// After
// Will Be Executed After content() Has Been Rendered
// Can Be Set Async
export function after(){
  console.log("AFTER: ", window.pageData);

}

///// Executes The Function When On Form Got Response
export function onFormGotResponse(response){}

///// Footer
export function footer(){
  return "This Is Demo Footer!";

}
