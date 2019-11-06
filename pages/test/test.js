const htmlSnip
=`<div class="div_class">
  <h1>Title2323</h1>
  <p class="p">
    Life is&nbsp;<i>like</i>&nbsp;a box of
    <b>&nbsp;chocolates</b>
  </p>
</div>`;

Page({
    data: {
        htmlSnip,
        renderedByHtml: false,
        renderedByNode: false,
        nodes: [{
            name: 'div',
            attrs: {
                class: 'div_class',
                style: 'line-height: 60px; color: #4F99FB;'
            },
            children: [{
                type: 'text',
                text: 'You never know what you\'re gonna get.'
            }]
        }]
    },
    renderHtml() {
        this.setData({
            renderedByHtml: true
        });
    },
    renderNode() {
        this.setData({
            renderedByNode: true
        });
    },
    enterCode(e) {
      this.setData({
          htmlSnip: e.detail.value
      });
    }
});