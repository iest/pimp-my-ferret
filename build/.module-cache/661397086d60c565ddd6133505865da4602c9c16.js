/** @jsx React.DOM */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TodoList = React.createClass({displayName: 'TodoList',
  getInitialState: function() {
    return {items: ['hello', 'world', 'click', 'me']};
  },
  handleAdd: function() {
    var newItems =
      this.state.items.concat([prompt('Enter some text')]);
    this.setState({items: newItems});
  },
  handleRemove: function(i) {
    var newItems = this.state.items;
    newItems.splice(i, 1);
    this.setState({items: newItems});
  },
  render: function() {
    var items = this.state.items.map(function(item, i) {
      return (
        React.DOM.div( {className:"item", key:item, onClick:this.handleRemove.bind(this, i)}, 
          item
        )
      );
    }.bind(this));
    return (
      React.DOM.div(null, 
        React.DOM.button( {onClick:this.handleAdd}, "Add Item"),
        ReactCSSTransitionGroup( {transitionName:"example"}, 
          items
        )
      )
    );
  }
});

React.renderComponent(
  TodoList(null ),
  document.getElementById('content')
);