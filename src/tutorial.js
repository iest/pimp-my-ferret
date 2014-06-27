/** @jsx React.DOM */

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TodoList = React.createClass({
  getInitialState: function() {
    return {items: ['hello', 'world', 'click', 'me']};
  },
  handleAdd: function(ev) {
    ev.preventDefault();
    var newItem = this.refs.todo.getDOMNode().value.trim();
    var newItems = this.state.items.concat([newItem]);
    this.setState({items: newItems});
    this.refs.todo.getDOMNode().value = '';
  },
  handleRemove: function(i) {
    var newItems = this.state.items;
    newItems.splice(i, 1);
    this.setState({items: newItems});
  },
  render: function() {
    var items = this.state.items.sort().map(function(item, i) {
      return (
        <li className="item" key={item} onClick={this.handleRemove.bind(this, i)}>
          {item}
        </li>
      );
    }.bind(this));
    return (
      <div>
        <form onSubmit={this.handleAdd}>
          <input type="text" ref="todo" placeholder="Name?" />
          <input type="Submit" value="Add Item" />
        </form>
        <ul>
          <ReactCSSTransitionGroup transitionName="example">
          {items}
          </ReactCSSTransitionGroup>
        </ul>
      </div>
    );
  }
});

React.renderComponent(
  <TodoList />,
  document.getElementById('content')
);