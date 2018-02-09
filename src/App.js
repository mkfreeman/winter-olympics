// Imports
import React, { Component } from 'react';
import { csv } from 'd3-request';
import { Treemap } from 'react-vis';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Label, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';


// Application component
class App extends Component {
    // Set initial state
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            sport: null,
            country: null
        }

    }

    // Load data when component mounts
    componentDidMount() {
        csv('data/all_data.csv', (error, data) => {
            this.setState({
                data: data
            });
        })
    }

    // Method to update sport
    updateSport(d) {
        this.setState({
            sport: d.data.title
        })
    }

    // Method to update country
    updateCountry(d) {
        this.setState({
            country: d.name
        })
    }

    // Render Method
    render() {
        // Create object of countries
        let countries = {};

        // Filter down to current sport
        this.state.data.filter((d) => {
            if (this.state.sport === null) return true
            return d.Sport === this.state.sport;
        }).forEach((d) => {
            if (countries[d.Country] === undefined) {
                countries[d.Country] = {
                    Gold: 0,
                    Silver: 0,
                    Bronze: 0
                }
            }
            countries[d.Country][d.Medal] += 1;
        })

        // Convert to array
        let countryData = [];
        Object.keys(countries).forEach((d) => countryData.push({
            name: d,
            gold: countries[d].Gold,
            silver: countries[d].Silver,
            bronze: countries[d].Bronze,
            total: countries[d].Gold + countries[d].Silver + countries[d].Bronze
        }));
        // Get top 15
        let filteredData = countryData.sort((a, b) => {
            return b.total - a.total
        }).filter((d, i) => i < 15)

        // Treemap Data
        let treeData = [];

        // Aggregate by sport
        let bySport = {};
        this.state.data.filter((d) => {
            if (this.state.country === null) return true
            return d.Country === this.state.country;
        }).forEach((d) => {
            if (bySport[d.Sport] === undefined) {
                bySport[d.Sport] = 0
            }
            bySport[d.Sport] += 1;
        })
        Object.keys(bySport).forEach((d) => treeData.push({
            title: d,
            size: bySport[d],
            style: {
                border: '1px solid white'
            }
        }))


        // Get labels
        let countryText = this.state.country === null ? "(all countries)" : `(${this.state.country})`
        let barLabel = this.state.sport === null ? "Total Medals" : `${this.state.sport} Medals`

        // Sizes
        let height = window.innerHeight - 150;
        let demoninator = window.innerWidth < 800 ? 1 : 2.2;
        let width = document.querySelector('.container') === null ? 1000 : Math.floor(document.querySelector('.container').offsetWidth / demoninator)
        // Return DOM elements 
        return (<div className="App">
                  <div className="container">
                    <h1>Winter Olympic Medals, 1924 - 2014</h1>
                    <p className="lead">Data from <a target="_blank" rel="noopener noreferrer" href="https://www.kaggle.com/the-guardian/olympic-games/data">Kaggle</a></p>
                  </div>
                  <div className="container">
                    <BarChart className="chart" layout="vertical" width={ width } height={ height } data={ filteredData } margin={ { top: 5, right: 30, left: 100, bottom: 15 } }>
                      <XAxis type="number">
                        <Label value={ barLabel } offset={ -10 } position="insideBottom" />
                      </XAxis>
                      <YAxis type="category" dataKey="name" />
                      <Tooltip/>
                      <Bar onMouseOut={ () => this.setState({
                                            country: null
                                        }) } onMouseOver={ this.updateCountry.bind(this) } dataKey="bronze" fill="#cd7f32" stackId="a" />
                      <Bar onMouseOut={ () => this.setState({
                                            country: null
                                        }) } onMouseOver={ this.updateCountry.bind(this) } dataKey="silver" fill="#c0c0c0" stackId="a" />
                      <Bar onMouseOut={ () => this.setState({
                                            country: null
                                        }) } onMouseOver={ this.updateCountry.bind(this) } dataKey="gold" fill="#FFD700" stackId="a" />
                    </BarChart>
                    <div className="chart">
                      <Treemap color={ "rgb(80, 183, 188)" } title='My New Treemap' animation={ true } onLeafMouseOut={ () => this.setState({
                                                                                                                            sport: null
                                                                                                                        }) } onLeafMouseOver={ this.updateSport.bind(this) }
                        hideRootNode={ true } data={ { children: treeData } } mode="squarify" height={ height } width={ width } />
                      <span className="treemapLabel">Medals by sport { countryText }</span>
                    </div>
                  </div>
                  <footer>
                    <div className="footer-copyright">
                      <div className="container">
                        © 2018 Copyright
                        <a href="http://mfviz.com/" rel="noopener noreferrer" target="_blank"> Michael Freeman</a>. Code is on <a rel="noopener noreferrer" href="https://github.com/mkfreeman/winter-olympics"
                          target="_blank">GitHub</a>
                        <a className="right" rel="noopener noreferrer" target="_blank" href="http://twitter.com/mf_viz">@mf_viz</a>
                      </div>
                    </div>
                  </footer>
                </div>
            );
    }
}

// Export component for rendering
export default App;