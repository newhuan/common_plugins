export function getInputItem( { key, id, type = "text", placeholder = "请输入您的" + key, value="" } ) {
    return $( `<div class="input-item clear">
                   <label for="${id}">${key}</label>
                   <input id="${id}" type="${type}" placeholder="${placeholder}" value="${value}">
               </div>` ).get( 0 );
}