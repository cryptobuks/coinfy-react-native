/**
 * Coinfy
 * Luigi Freitas Cruz 2H2016
 * https://github.com/luigifreits
 * @flow
 */

import React, { Component } from 'react';
import dateFormat from 'dateformat';
import CoinfyAPI from './CoinfyAPI';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions,
  TouchableWithoutFeedback,
  Clipboard,
  Vibration,
  AsyncStorage,
  Picker
} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Cell extends Component {

  copy() {
    Vibration.vibrate(1);
    Clipboard.setString(CoinfyAPI.getQuotation(this.props.currencyList, this.props.curency));
  }

  render() {
    return (
      <TouchableWithoutFeedback onLongPress={this.copy.bind(this)}>
        <View style={styles.cell}>
            <Text style={styles.cellCurrency}>{this.props.curency}</Text>
            <Text style={styles.cellCurrencyName}>{CoinfyAPI.getName(this.props.curency)}</Text>
            <Text style={styles.cellQuotation}>
              {CoinfyAPI.getSymbol(this.props.curency)}
              {CoinfyAPI.getQuotation(this.props.currencyList, this.props.curency)}
            </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class Showroom extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(props.userList)
    };
  }

  componentWillReceiveProps(props) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({ dataSource: ds.cloneWithRows(props.userList) });
  }

  render() {
    return (
      <ListView
        contentContainerStyle={styles.list}
        dataSource={this.state.dataSource}
        enableEmptySections={true}
        renderRow={(rowData) => <Cell currencyList={this.props.currencyList} curency={rowData} />}
      />
    );
  }
}

class Coinfy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currencyList: [],
      userList: ["BRL", "USD", "EUR", "AUD", "CAD"],
      currencyBase: '---',
      updatedDate: null,
      weekDay: 'Hello!\n',
      fullDay: 'Welcome to Coinfy',
      status: 'FETCHING NEW QUOTATION...',
      pickView: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      AsyncStorage.getItem('LAST_DATA').then((value) => {
        if (value != null) {
          const lastData = JSON.parse(value);
          this.setState({
            //userList: lastData.userList != undefined ? lastData.userList : [],
            currencyBase: lastData.currencyBase != undefined ? lastData.currencyBase : 'USD'
          });
          this._fetchQuotation();
        }
      }).done();
    }, 1000);
  }

  _fetchQuotation() {
    this.setState({ status: 'FETCHING NEW QUOTATION...' });
    CoinfyAPI.currencyList(this.state.currencyBase, (err, list) => {
      const date = dateFormat(list.date, "fullDate", true).split(',');
      const data = {
        currencyBase: list.base,
        currencyList: list.rates,
        updatedDate: date,
        weekDay: `${date[0]},`,
        fullDay: `\n${date[1].replace(' ','')},${date[2]}`,
        status: 'LAST QUOTE AVAILABLE'
      }
      this.setState(data);
    });
  }

  _currencyChange(currency) {
    this.setState({ currencyBase: currency });
    AsyncStorage.setItem('LAST_DATA', JSON.stringify({
      currencyBase: currency
    })).then(() => {
      this._fetchQuotation();
    });
  }

  _cyclePickView() {
    this.setState({ pickView: this.state.pickView ? false : true });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.updatedDateWeekday}>{this.state.weekDay}{this.state.fullDay}</Text>
          <TouchableWithoutFeedback onPress={this._cyclePickView.bind(this)}>
            <View style={styles.currencyBase}>
              <Text style={styles.currencyBaseText}>{this.state.currencyBase}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={styles.headerStatus}>{this.state.status}</Text>
          <View style={styles.headerSeparator}></View>
        </View>
        <Showroom currencyList={this.state.currencyList} userList={this.state.userList}/>
        {this.state.pickView ? (
          <Picker
            selectedValue={this.state.currencyBase}
            onValueChange={(currency) => this._currencyChange(currency)}>
            {CoinfyAPI.getCurrencies().map((s, i) => {
              return <Picker.Item key={i} value={s} label={s}/>
            })}
          </Picker>
        ) : null }
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  cellCurrency: {
    backgroundColor: 'transparent',
    fontSize: 20,
    color: '#4A4A4A',
    fontWeight: '600'
  },
  cellCurrencyName: {
    color: '#969696',
    fontSize: 16
  },
  cellQuotation: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    fontSize: 40,
    fontWeight: '300',
    color: '#4A4A4A'
  },
  list: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 30,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  cell: {
    padding: 5,
    paddingRight: 7,
    paddingLeft: 7,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    width: (width / 2) - 20,
    height: 90,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E4EAED',
    backgroundColor: '#EBF2F5',
  },
  headerStatus: {
    color: '#ADADAD',
    paddingTop: 1,
    fontWeight: '500'
  },
  updatedDateWeekday: {
    fontSize: 35,
    fontWeight: '700',
    color: '#4A4A4A'
  },
  headerSeparator: {
    height: 1,
    marginTop: 8,
    backgroundColor: '#D6D6D6',
    borderRadius: 5
  },
  currencyBaseText: {
    color: 'white',
    fontSize: 25,
    fontWeight: '400'
  },
  currencyBase: {
    backgroundColor: '#10C425',
    borderRadius: 10,
    position: 'absolute',
    right: 15,
    top: 50,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 7
  },
  header: {
    height: height / 6,
    padding: 10,
    paddingTop: 40,
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('Coinfy', () => Coinfy);
