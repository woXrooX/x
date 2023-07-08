"use strict";

///// toast
setTimeout(()=>{window.Toast.new("success", "success");}, 1000);
setTimeout(()=>{window.Toast.new("info", "info");}, 2000);
setTimeout(()=>{window.Toast.new("warning", "warning");}, 3000);
setTimeout(()=>{window.Toast.new("error", "error");}, 4000);


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
const share = `
<container class="m-t-5">

  <row><h1>Share (x-share)</h1></row>

  <row class="box-default w-25 p-5" class="g-1">
    <column><x-share></x-share></column>
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
    ${tooltips}
    ${share}
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
