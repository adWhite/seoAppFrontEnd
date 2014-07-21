/** @jsx React.DOM */

var React = require('react'),
  _ = require('lodash'),
  $ = require('jquery');

// ## Utils

// ## Validate URL 
// https://gist.github.com/thinkxl/038d2c99db30de40de4c
var re_weburl = new RegExp(
  "^" +
    "(?:(?:https?|ftp)://)" +
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    ")" +
    "(?::\\d{2,5})?" +
    "(?:/\\S*)?" +
  "$", "i"
);

var FormView = React.createClass({
  componentDidUpdate: function() {
    console.log(this.state.data); 
  },

  componentDidMount: function() {
    this._form = this.refs.appForm.getDOMNode(); 
  },

  // validate if is a valid URL
  _validateURL: function(url) {
    return re_weburl.test(url) || false;
  },

  // if the form is valid, then we do ajax call
  _formIsValidActions: function(field, url) {
    field.style.border = "1px solid green";

    var self = this;

    $.ajax({
      url: self.props.api,
      data: { url: url },
      type: "JSON",
      method: "GET"
    })
    
    .done(function(data) {
      var seoData = data.seo;

      self.setState({ data: seoData });

      self._renderList();
    })

    .fail(function(xhr, status, error) {
      console.error("Something went wrong!");
    })

    .always(function() {
      console.log("API Called!"); 
    });
  },

  // if form is not valid, alert through UI
  _formIsInvalidActions: function(field) {
    field.style.border = "1px solid red";  

    // ... do UI alert to inform about error
  },

  // Here we are going to validate URL and do action depending
  // if is it or not
  _handleSubmit: function(e) {
    e.preventDefault();

    var 
      domainField = this.refs.domainField.getDOMNode(),
      url = domainField.value,
      hasHTTP = url.indexOf("http://") > -1;

    // if URL doesn't include HTTP append to it
    // else, remove from form 
    if (!hasHTTP) {
      url = "http://" + url;
    } else {
      domainField.value = url.replace("http://", "");
    }

    var isValid = this._validateURL(url);

    if (isValid) {
      this._formIsValidActions(domainField, url);
    } else {
      this._formIsInvalidActions(domainField);
    }
  },

  _renderList: function() {
    var list = [];

    _.each(this.state.data.speed.formattedResults.ruleResults, function(value, key) {
      list.push(value);    
    });

    console.log(list);

    list.map(function(value, key) {
      return (
        <p>{value} <strong>{key}</strong></p>
      ); 
    });
  },

  render: function() {
    return (
      <div className="app-form">
        <h2>Seo Checking</h2>
        <form onSubmit={this._handleSubmit} ref="appForm">
          <p>http://<input type="text" name="domainField" ref="domainField"/></p>
          <button>Submit</button>
        </form>
        <hr />
        {this._renderList}
      </div>
    );
  } 
});

React.renderComponent(<FormView api="http://hidden-taiga-3220.herokuapp.com/v1/seo"/>, document.getElementById('app'));
