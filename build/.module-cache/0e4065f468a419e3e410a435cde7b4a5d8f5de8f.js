/** @jsx React.DOM */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TodoList = React.createClass({displayName: 'TodoList',
  getInitialState: function() {
    return {items: ['hello', 'world', 'click', 'me']};
  },
  handleAdd: function() {
    var newItems = this.state.items.concat([this.state.value]);
    this.setState({items: newItems});
  },
  handleRemove: function(i) {
    var newItems = this.state.items;
    newItems.splice(i, 1);
    this.setState({items: newItems});
  },
  render: function() {
    var items = this.state.items.sort().map(function(item, i) {
      return (
        React.DOM.li( {className:"item", key:item, onClick:this.handleRemove.bind(this, i)}, 
          item
        )
      );
    }.bind(this));
    return (
      React.DOM.div(null, 
        React.DOM.input( {value:this.state.value, placeholder:"Name?"} ),
        React.DOM.button( {onClick:this.handleAdd}, "Add Item"),
            React.DOM.ul(null, 
              ReactCSSTransitionGroup( {transitionName:"example"}, 
              items
              )
            )
      )
    );
  }
});

React.renderComponent(
  TodoList(null ),
  document.getElementById('content')
);