import React, { Component } from 'react'
import { Link } from "@reach/router"
import { initialHistory } from '../../utils/analytics/plugins/visualize-analytics'
import analytics from '../../utils/analytics'
import Navigation from '../../fragments/Nav'
import Log from '../../components/Log'
import './Home.css'

export default class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      history: window.__ANALYTICS_HISTORY__ || []
    }
  }
  componentDidMount() {
    this.listener = analytics.on('*', ({ payload }) => {
      this.setState({
        history: window.__ANALYTICS_HISTORY__.concat(payload)
      })
    })
    setInterval(() => {
      this.setState({
        history: window.__ANALYTICS_HISTORY__
      })
    }, 1000);

    analytics.on('page:segment', ({ payload }) => {
      console.log('analytics.on page:segment')
    })

    analytics.on('page', ({ payload }) => {
      console.log('PAGE', payload)
    })

    analytics.on('setOriginalSource', ({ payload }) => {
      console.log('payload', payload)
    })
    // analytics.on('reset', ({ payload }) => {
    //   alert('middle reset')
    // })
    //
    // analytics.on('resetStart', ({ payload }) => {
    //   alert('start reset')
    // })
    //
    // analytics.on('resetEnd', ({ payload }) => {
    //   alert('end reset')
    // })
  }
  componentWillUnmount() {
    this.listener()
  }
  doPage = () => {
    analytics.page(() => {
      console.log('page callback')
    })
  }
  doTrack = () => {
    analytics.track('buttonClicked', {
      foo: 'bar'
    }, () => {
      console.log('track callback')
    })
  }
  doIdentify = () => {
    analytics.identify('xyz-777', {
     traitOne: 'blue',
     traitTwo: 'red',
     companyName: 'lol corp',
     testing_value: 'hi',
     // first_name: 'steve',
     // lastName: 'john'
   }, () => {
     console.log('identify callback')
   })
  }
  render() {
    const { history } = this.state
    return (
      <div className="App">
        <Navigation />
        <h2>
          <a href='https://github.com/DavidWells/analytics'>Analytics</a>
          <span className="install">npm install analytics</span>
        </h2>
        <div className="about">
          <p>
            Lightweight extendable analytics library designed to work with any third party analytics provider to <b>track page views</b>, <b>custom events</b>, & <b>identify users</b>.
          </p>
        </div>
        <button onClick={this.doPage} title='Fire a page view'>
          {`analytics.page()`}
        </button>
        <button onClick={this.doTrack} title='Track an event'>
          {`analytics.track()`}
        </button>
        <button onClick={this.doIdentify} title='Identify a visitor'>
          {`analytics.identify()`}
        </button>
        <h3>Lifecycle</h3>
        <Log items={history} />
      </div>
    )
  }
}
