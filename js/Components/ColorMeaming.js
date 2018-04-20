export default {
    template: `
    <div class="alert alert-info">
        <dl class="color-meaning">
            <dt>履修状況</dt>
            <dd class="color-meaning__non-active">未履修</dd>
            <dd class="color-meaning__item--active">履修中</dd>
            <dt>必選別</dt>
            <dd class="color-meaning__item--required">必修</dd>
            <dd class="color-meaning__item--elective-required">選択必修</dd>
            <dd class="color-meaning__item--elective">選択・任意</dd>
            <dd class="color-meaning__item--re-required">特別授業</dd>
        </dl>
    </div>
  `
};