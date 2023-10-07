import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import ProjectsList from '../ProjectsList'

import './index.css'

const apStatus = {
  initial: 'initial',
  loading: 'loading',
  success: 'success',
  fail: 'fail',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

class Project extends Component {
  state = {inputValue: categoriesList[0].id, api: apStatus.initial, data: []}

  componentDidMount() {
    this.getProjectsList()
  }

  onchangeValue = event => {
    this.setState({inputValue: event.target.value}, this.getProjectsList)
  }

  getProjectsList = async () => {
    this.setState({api: apStatus.loading})

    const {inputValue} = this.state

    const uRl = `https://apis.ccbp.in/ps/projects?category=${inputValue}`

    const options = {
      method: 'GET',
    }
    const response = await fetch(uRl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({data: updateData, api: apStatus.success})
    } else {
      this.setState({api: apStatus.fail})
    }
  }

  loadingView = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {data} = this.state
    return (
      <div className="lists-con">
        <ul className="listItems">
          {data.map(eachProject => (
            <ProjectsList details={eachProject} key={eachProject.id} />
          ))}
        </ul>
      </div>
    )
  }

  failureView = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="ima"
        alt="failure view"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="but" type="button" onClick={this.getProjectsList}>
        Retry
      </button>
    </div>
  )

  finalRender = () => {
    const {api} = this.state
    switch (api) {
      case apStatus.loading:
        return this.loadingView()
      case apStatus.success:
        return this.successView()
      case apStatus.fail:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    const {inputValue} = this.state

    return (
      <div className="app-container">
        <div className="nav-bar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <ul>
          <select
            className="selectItem"
            onChange={this.onchangeValue}
            value={inputValue}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </ul>
        {this.finalRender()}
      </div>
    )
  }
}

export default Project
