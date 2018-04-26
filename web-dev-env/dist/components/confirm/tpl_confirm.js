import { imageRoot } from "../../config"
export let confirmTpl = `
<div class="confirm-cover">
    <div class="confirm-container">
        <div class="confirm-body">
            <p class="confirm-text"></p>
        </div>
        <div class="confirm-concel">
            <img src="${ imageRoot }./components/confirm/imgs/delete.png" alt="" title="">
        </div>
        <div class="confirm-submit">确定</div>
    </div>
</div>`;
