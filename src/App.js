import './App.css';
//import backImage from './hud.jpg'
import React, {Component} from 'react'

const commonNumberSystems = {
  binary: {description: 'Binary', base: 2},
  octal: {description: 'Octal', base: 8},
  decimal: {description: 'Decimal', base: 10},
  hex: {description: 'Hexadecimal', base: 16}
}

// function printDetails(obj){
//   let s = "";
//   for(let key of Object.keys(obj)){
//     s+=`${key.padStart(10," ")}: ${obj[key]}\n`
//   }
//   return s
// }

class NumberSystemConverter extends Component {
  constructor(props){
    super(props)

    this.handleBinaryChange = this.handleBinaryChange.bind(this)
    this.handleDecimalChange = this.handleDecimalChange.bind(this)
    this.handleOctalChange = this.handleOctalChange.bind(this)
    this.handleHexadecimalChange = this.handleHexadecimalChange.bind(this)
    this.state = {
      numberSystem: '',
      number: 0,
    }
  }

  handleBinaryChange(number){
    this.setState({
      numberSystem: 'binary',
      number: number
    })
  }

  handleDecimalChange(number){
    this.setState({
      numberSystem: 'decimal',
      number: number
    })
  }

  handleOctalChange(number){
    this.setState({
      numberSystem: 'octal',
      number: number
    })
  }

  handleHexadecimalChange(number){
    this.setState({
      numberSystem: 'hex',
      number: number
    })
  }

  render() {
    const system = this.state.numberSystem
    const number = this.state.number
    const binary = system !== 'binary' ? convertNumberSystem(number, system, 'binary') : number
    const octal = system !== 'octal' ? convertNumberSystem(number, system, 'octal') : number
    const decimal = system !== 'decimal' ? convertNumberSystem(number, system, 'decimal') : number
    const hex = system !== 'hex' ? convertNumberSystem(number, system, 'hex') : number
    return (
      <div className='calc-wrapper'>
        <h2>Common Number Systems</h2>
        <NumberInput number={binary} numberSystem='binary' onNumberChange={this.handleBinaryChange} />
        <NumberInput number={octal} numberSystem='octal' onNumberChange={this.handleOctalChange} />
        <NumberInput number={decimal} numberSystem='decimal' onNumberChange={this.handleDecimalChange} />
        <NumberInput number={hex} numberSystem='hex' onNumberChange={this.handleHexadecimalChange} />
      </div>
    )
  }
}

function convertNumberSystem(number, from, to){
  return commonNumberSystems[from] ? fromDecimal(toDecimal(number, commonNumberSystems[from].base), commonNumberSystems[to].base) : 0
}

function fromDecimal(number, to) {
  const hexV = {'10':'A', '11':'B', '12':'C', '13':'D', '14':'E', '15':'F'}
  let N = parseInt(number)
  let output = ""
  if(N){
    let max = Math.floor(Math.log(number) / Math.log(to))
    let quotient = 0, dividend = N, divisor;
    for(let i=max;i>=0;i--){
      divisor = to**i
      if(dividend<divisor){
        output+=0
        continue
      }
      quotient = Math.floor(dividend/divisor)
      dividend = dividend%divisor
      output+= quotient>=10 ? hexV[quotient+""] : quotient
    }
  }else{
    return '0'
  }
  return output
}

function toDecimal(number, from) {
  const hexV = {A:10, B:11, C:12, D:13, E:14, F:15}
  const numberString = number+""
  let sum = 0
  if(from>=10) {
    for(let i=0, y=numberString.length-1;i<numberString.length;i++,y--){
      sum += (from**y)*parseInt(Object.keys(hexV).indexOf(numberString[i]) > -1 ? hexV[numberString[i]]+"" : numberString[i])
    }
  } else {
    if(numberString[numberString.length-1] === from+""){
      return "0"
    }
    for(let i=0, y=numberString.length-1;i<numberString.length;i++,y--){
      sum += (from**y)*parseInt(numberString[i])
    }
  }

  return sum+""
}

class CustomizedConvertion extends Component {
  constructor(props){
    super(props)
    
    this.handleFrom = this.handleFrom.bind(this)
    this.handleTo = this.handleTo.bind(this)
    this.state = {
      baseFrom: '10',
      numberFrom: '596',
      baseTo: '2',
      numberTo: '0',
      changeCause: 'From'
    }
  }

  handleFrom(name, value) {
    this.setState({
      [name]: value,
      changeCause : name.slice(-4)
    })
  }

  handleTo(name, value) {
    console.log(name, value)
    this.setState({
      [name]: value,
      changeCause : name.slice(-2)
    })
  }

  render() {
    let latestUpdate = {...this.state}

    if(this.state.changeCause === "From") {
      latestUpdate.numberTo = fromDecimal(toDecimal(latestUpdate.numberFrom, latestUpdate.baseFrom), latestUpdate.baseTo)
    } else {
      latestUpdate.numberFrom = fromDecimal(toDecimal(this.state.numberTo, this.state.baseTo), this.state.baseFrom)
    }

    latestUpdate.numberFrom = Boolean(latestUpdate.numberFrom) ? latestUpdate.numberFrom : 0
    latestUpdate.numberTo = Boolean(latestUpdate.numberTo) ? latestUpdate.numberTo : 0

    return (
      <div className='customized-conversion'>
        <h2>Customized Conversion</h2>
          <BaseInput where="From" onInputChange={this.handleFrom} base={latestUpdate.baseFrom} number={latestUpdate.numberFrom} />
          <BaseInput where="To" onInputChange={this.handleTo} base={latestUpdate.baseTo} number={latestUpdate.numberTo} />
      </div>
    )
  }
}

class BaseInput extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.props.onInputChange(event.target.name ,event.target.value)
  }

  render() {
    return (
      <div className='conversions'>
        <fieldset>
          <legend>{this.props.where}</legend>
          <div className='input-div'><label>Base :</label><input type="number" name={"base"+this.props.where} onChange={this.handleChange} value={this.props.base+""} required /></div>
          <div className='input-div'><label>Number :</label><input type="text" name={"number"+this.props.where} onChange={this.handleChange} value={this.props.number+""} required /></div>
        </fieldset>
      </div>
    )
  }
}

class NumberInput extends Component {
  constructor(props){
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.props.onNumberChange(event.target.value)
  }

  render(){
    return (
      <div className='inputs'>
        <fieldset>
          <legend>{commonNumberSystems[this.props.numberSystem].description}</legend>
          <input onChange={this.handleChange} value={this.props.number}/>
        </fieldset>
      </div>
    )
  }
}

function App(){
  return (
    <div className='outer-wrapper'>
      <h1>Number System Converter</h1>
      <div className='wrapper'>
        <NumberSystemConverter />
        <CustomizedConvertion />
      </div>
      <p id='foot'>&copy; Copyright <b>ochiengerick</b>  2022</p>
    </div>
  )
}

export default App;