import React, { Component } from 'react';
import { connect } from "react-redux";
import $ from 'jquery';
import './search.css'
import { fetchAirlineList } from '../../api/flightApi'
import { getAirlineList } from "../../selectors";
import _ from 'lodash';
const Fuse = require('fuse.js');

class AirlineList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickedBooked: false,
    }
  }

  componentDidMount() {
    fetchAirlineList();
  }

  render() {
    let optionsF = {
      shouldSort: true,
      threshold: 0.4,
      maxPatternLength: 32,
      keys: [{
        name: 'airlineIATA',
        weight: 0.5
      }, {
        name: 'airlineName',
        weight: 0.3
      }, {
        name: 'airlineCountry',
        weight: 0.2
      }]
    };

    let airlines = this.props.airlineList;
    let fuse = new Fuse(airlines, optionsF)

    var ac = $('#autocomplete')
      .on('click', function (e) {
        e.stopPropagation();
      })
      .on('focus keyup', search)
      .on('keydown', onKeyDown);

    let airlineCodeForSearch = $('#airline');

    var wrap = $('<div>')
      .addClass('autocomplete-wrapper')
      .insertBefore(ac)
      .append(ac);

    var list = $('<div>')
      .addClass('autocomplete-results')
      .on('click', '.autocomplete-result', function (e) {
        e.preventDefault();
        e.stopPropagation();
        selectIndex($(this).data('index'));
        $('.autocomplete-result').hide();
      })
      .appendTo(wrap);

    $(document)
      .on('mouseover', '.autocomplete-result', function (e) {
        var index = parseInt($(this).data('index'), 10);
        if (!isNaN(index)) {
          list.attr('data-highlight', index);
        }
      })
      .on('click', clearResults);

    function clearResults() {
      results = [];
      numResults = 0;
      list.empty();
    }

    function selectIndex(index) {
      if (results.length >= index + 1) {
        ac.val(results[index].airlineIATA + ', ' + results[index].airlineName + ' - ' + results[index].airlineCountry);
        airlineCodeForSearch.val(results[index].airlineIATA);
        clearResults()
      }
    }

    var results = [];
    var numResults = 0;
    var selectedIndex = -1;

    function search(e) {
      if (e.which === 38 || e.which === 13 || e.which === 40) {
        return;
      }

      if (ac.val().length > 0) {
        results = _.take(fuse.search(ac.val()), 3);
        numResults = results.length;
        var divs = results.map(function (r, i) {
          return '<div class="autocomplete-result" data-index="' + i + '">'
            + '<div><b>' + r.airlineIATA + '</b> - ' + r.airlineName + '</div>'
            + '<div class="autocomplete-location">' + r.airlineCountry + '</div>'
            + '</div>';
        });

        selectedIndex = -1;
        list.html(divs.join(''))
          .attr('data-highlight', selectedIndex);

      } else {
        numResults = 0;
        list.empty();
      }
    }

    function onKeyDown(e) {
      switch (e.which) {
        case 38: // up
          selectedIndex--;
          if (selectedIndex <= -1) {
            selectedIndex = -1;
          }
          list.attr('data-highlight', selectedIndex);
          break;
        case 13: // enter
          selectIndex(selectedIndex);
          break;
        case 9: // enter
          selectIndex(selectedIndex);
          e.stopPropagation();
          return;
        case 40: // down
          selectedIndex++;
          if (selectedIndex >= numResults) {
            selectedIndex = numResults - 1;
          }
          list.attr('data-highlight', selectedIndex);
          break;

        default: return; // exit this handler for other keys
      }
      e.stopPropagation();
      e.preventDefault(); // prevent the default action (scroll / move caret)
    }
    return (
      <div className="form-group">
        <label htmlFor="iata">Select AirLine</label>
        <input className="form-control form-control-color appBodyFontFamily appBodyFontColor" type="text" placeholder="For example: Jet Airways, Indigo, Vistara" id="autocomplete" autoComplete="off"/>
        <input name={this.props.name} id="airline" type="hidden" />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    airlineList: getAirlineList(state)
  }
}

export default connect(mapStateToProps)(AirlineList);