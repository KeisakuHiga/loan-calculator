let calculateButton = document.querySelector('button')
calculateButton.addEventListener('click', (event) => {
  event.preventDefault()

  // conditions
  let principalAmount = document.querySelector("input[name='principal-amount']").value
  let loanTerm = document.querySelector("input[name='loan-term']").value // months
  let interestRate = document.querySelector("input[name='interest-rate']").value // per year
  let monthlyInterestRate = interestRate / 12 / 100 // per month

  if(document.querySelector("#principal").checked) {
    principalEqualRepayment(principalAmount, loanTerm, monthlyInterestRate)
  } else {
    priAndIntEqualRepayment(principalAmount, loanTerm, monthlyInterestRate)
  }
})

// principal equal repayment
const principalEqualRepayment = (principalAmount, loanTerm, monthlyInterestRate) => {
  let monthlyPrinciplePayment = Math.ceil(principalAmount / loanTerm * 100) /100
  let totalInterestAmount = 0
  let totalPaymentAmount = 0
  let restOfPrincipalAmount = principalAmount
  let originalPrincipalAmount = principalAmount
  principalAmount = 0
  let table = document.querySelector('#calculation-table')
  table.innerHTML = null
  const tableHead = `
  <thead>
    <tr>
      <th scope="col">Term</th>
      <th scope="col">Monthly Payment</th>
      <th scope="col">Principal</th>
      <th scope="col">Interest</th>
      <th scope="col">Rest of principal</th>
    </tr>
  </thead>
  <tbody></tbody>
  `
  table.insertAdjacentHTML('beforeend', tableHead)
  let tBody = document.querySelector('tbody')

  for (let i = 1; i <= loanTerm; i++) {
    let monthlyInterestPayment = Math.ceil((restOfPrincipalAmount * monthlyInterestRate) * 100) / 100
    let monthlyRent = Math.ceil((monthlyPrinciplePayment + monthlyInterestPayment) * 100) / 100
    totalInterestAmount += monthlyInterestPayment
    totalPaymentAmount += monthlyRent
    restOfPrincipalAmount -= monthlyPrinciplePayment
    restOfPrincipalAmount = restOfPrincipalAmount
    principalAmount += monthlyPrinciplePayment

    if (i != loanTerm) {
      let paymentInfo = `
        <tr>
          <td scope="row">Term${i}</td>
          <td>${formatter.format(monthlyRent)}</td>
          <td>${formatter.format(monthlyPrinciplePayment)}</td>
          <td>${formatter.format(monthlyInterestPayment)}</td>
          <td>${formatter.format(restOfPrincipalAmount)}</td>
        </tr>
      `
      tBody.insertAdjacentHTML('beforeend', paymentInfo)

    } else {
      let difference = originalPrincipalAmount - principalAmount
      monthlyRent += difference
      monthlyPrinciplePayment += difference
      totalPaymentAmount += difference
      principalAmount += difference
      restOfPrincipalAmount = 0

      let paymentInfo = `
      <tr>
        <td scope="row">Term${i}</td>
        <td>${formatter.format(monthlyRent)}</td>
        <td>${formatter.format(monthlyPrinciplePayment)}</td>
        <td>${formatter.format(monthlyInterestPayment)}</td>
        <td>${formatter.format(restOfPrincipalAmount)}</td>
      </tr>
    `
    tBody.insertAdjacentHTML('beforeend', paymentInfo)
    }
  }
  totalPaymentAmount = Math.ceil(totalPaymentAmount * 100) / 100
  const totalPaymentInfo = `
    <tr>
      <td>---</td>
      <td>---</td>
      <td>---</td>
      <td>---</td>
      <td>---</td>
    </tr>
    <tr>
      <td>Total</td>
      <td>${formatter.format(totalPaymentAmount)}</td>
      <td>${formatter.format(principalAmount)}</td>
      <td>${formatter.format(totalInterestAmount)}</td>
      <td>$0.00</td>

    </tr>
  `
  tBody.insertAdjacentHTML('beforeend', totalPaymentInfo)
}


// principal and interest equal repayment
// Reference http://blog.graviness.com/?eid=715663
// 毎月の返済額 ＝ 10,000,000 × interestRate ÷ (1 － (1 ＋ interestRate)＾(－20 × 12)) 
const priAndIntEqualRepayment = (principalAmount, loanTerm, monthlyInterestRate) => {
  let monthlyRent = Math.ceil((principalAmount * monthlyInterestRate) / (1 - Math.pow((1 + monthlyInterestRate), -loanTerm)) * 100) / 100
  let totalPaymentAmount = 0
  let totalInterestAmount = 0
  let restOfPrincipalAmount = principalAmount
  let originalPrincipalAmount = principalAmount
  principalAmount = 0
  let table = document.querySelector('#calculation-table')
  table.innerHTML = null
  const tableHead = `
    <thead>
      <tr>
        <th scope="col">Term</th>
        <th scope="col">Monthly Payment</th>
        <th scope="col">Principal</th>
        <th scope="col">Interest</th>
        <th scope="col">Rest of principal</th>
      </tr>
    </thead>
    <tbody></tbody>
  `
  table.insertAdjacentHTML('beforeend', tableHead)
  let tBody = document.querySelector('tbody')

  for (let i = 1; i <= loanTerm; i++) {
    let monthlyInterestPayment = Math.ceil((restOfPrincipalAmount * monthlyInterestRate) * 100) / 100
    let monthlyPrinciplePayment = monthlyRent - monthlyInterestPayment
    totalPaymentAmount += monthlyRent
    principalAmount += monthlyPrinciplePayment
    totalInterestAmount += monthlyInterestPayment
    restOfPrincipalAmount -= monthlyPrinciplePayment
    
    // let monthlyPrinciplePayment = Math.ceil((monthlyRent - monthlyInterestPayment) * 100) / 100
    // totalInterestAmount = Math.ceil(totalInterestAmount * 100) / 100
    // restOfPrincipalAmount = Math.ceil(restOfPrincipalAmount * 100) / 100

    if (i != loanTerm) {
      let paymentInfo = `
      <tr>
        <td scope="row">Term${i}</td>
        <td>${formatter.format(monthlyRent)}</td>
        <td>${formatter.format(monthlyPrinciplePayment)}</td>
        <td>${formatter.format(monthlyInterestPayment)}</td>
        <td>${formatter.format(restOfPrincipalAmount)}</td>
      </tr>
      `
      tBody.insertAdjacentHTML('beforeend', paymentInfo)

    } else {
      let difference = originalPrincipalAmount - principalAmount
      monthlyRent += difference
      monthlyPrinciplePayment += difference

      principalAmount += difference
      totalPaymentAmount += difference
      totalInterestAmount += difference
      
      restOfPrincipalAmount = 0
      let paymentInfo = `
      <tr>
        <td scope="row">Term${i}</td>
        <td>${formatter.format(monthlyRent)}</td>
        <td>${formatter.format(monthlyPrinciplePayment)}</td>
        <td>${formatter.format(monthlyInterestPayment)}</td>
        <td>${formatter.format(restOfPrincipalAmount)}</td>
      </tr>
      `
      tBody.insertAdjacentHTML('beforeend', paymentInfo)
    }
  }
  const totalPaymentInfo = `
    <tr>
      <td>---</td>
      <td>---</td>
      <td>---</td>
      <td>---</td>
      <td>---</td>
    </tr>
    <tr>
      <td>Total</td>
      <td>${formatter.format(totalPaymentAmount)}</td>
      <td>${formatter.format(principalAmount)}</td>
      <td>${formatter.format(totalInterestAmount)}</td>
      <td>$0.00</td>

    </tr>
  `
  tBody.insertAdjacentHTML('beforeend', totalPaymentInfo)
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})