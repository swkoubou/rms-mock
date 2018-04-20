export default {
    template: `
    <div class="container">
        <div class="btn-group dropup" role="group">
            <button class="btn btn-default dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" title="印刷">
                {{year}}
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu">
              <li role="presentation"><a role="menuitem">1年</a></li>
              <li role="presentation"><a role="menuitem">2年</a></li>
              <li role="presentation"><a role="menuitem">3年</a></li>
              <li role="presentation"><a role="menuitem">4年</a></li>
            </ul>
          </div>
          <div class="btn-group dropup" role="group">
            <button class="btn btn-default dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" title="印刷">
                {{section}}
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu">
              <li role="presentation"><a role="menuitem">前期</a></li>
              <li role="presentation"><a role="menuitem">後期</a></li>
            </ul>
        </div>
        <!-- <div class="btn-group">
            <button class="btn btn-default" @click="" data-toggle="tooltip" title="必修科目をすべて選択">
                    <span class="glyphicon glyphicon-plus-sign"></span> 必修科目をすべて選択
            </button>
            <div class="btn-group dropup" role="group">
                <button class="btn btn-default dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" title="印刷">
                    <span class="glyphicon glyphicon-print"></span> 印刷
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu">
                <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('printFirst') ?>">前期</a></li>
                <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('printSecond') ?>">後期</a></li>
                <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('print') ?>">全期</a></li>
                </ul>
            </div>
        </div> -->

        <div class="relative pull-right">
          <div class="btn-group">
            <button class="btn btn-default" @click="" data-toggle="tooltip" title="必修科目をすべて選択">
              <span class="glyphicon glyphicon-plus-sign"></span> 必修科目をすべて選択
            </button>
            <div class="btn-group dropup" role="group">
              <button class="btn btn-default dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" title="印刷">
                  <span class="glyphicon glyphicon-print"></span> 印刷
                  <span class="caret"></span>
              </button>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownmenu">
              <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('printFirst') ?>">前期</a></li>
              <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('printSecond') ?>">後期</a></li>
              <li role="presentation"><a role="menuitem" href="<?php $this->linkTo('print') ?>">全期</a></li>
              </ul>
            </div>
          </div>
          <div class="btn-group">
              <button class="btn btn-danger"  data-toggle="modal" data-target="#reset_modal" title="リセット">
              <span class="glyphicon glyphicon-trash"></span> リセット
              </button>
              <button class="btn btn-primary"  data-toggle="modal" data-target="#reset_modal" title="保存">
                保存
              </button>
          </div>
        </div>
    </div>`,
  data() {
    return {
      year: '1年',
      section: '後期'
    };
  }
};