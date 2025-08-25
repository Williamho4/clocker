Cypress.Commands.add('login', (email, password) => {
  cy.get('[data-id="email-sign-in-input"]').type(email)
  cy.get('[data-id="password-sign-in-input"]').type(password)
  cy.get('[data-id="sign-in-btn"]').click()
})

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('login', () => {
    cy.contains(/Sign in/i)

    cy.login('demo@demo.se', 'demo12345')

    cy.location('pathname').should('eq', '/application/start')
    cy.contains(/Welcome/i)
  })

  it('fail login', () => {
    cy.contains(/Sign in/i)

    cy.login('demo@demo.se', 'demo12341')

    cy.get('[data-id="sign-in-error"]').should('exist')
  })

  it('logout', () => {
    cy.login('demo@demo.se', 'demo12345')

    cy.get('[data-id="user-dropdown-btn"]', { timeout: 8000 }).click()
    cy.get('[data-id="logout-btn"]').click()

    cy.location('pathname').should('eq', '/auth/sign-in')
  })

  it('not admin test', () => {
    cy.login('demo@demo.se', 'demo12345')

    cy.contains('member').first().click()
    cy.location('pathname').should('eq', '/application')
    cy.visit('/application/admin')
    cy.location('pathname').should('eq', '/application')
  })

  it('is admin test', () => {
    cy.login('demo@demo.se', 'demo12345')

    cy.contains('owner').first().click()
    cy.location('pathname').should('eq', '/application')
    cy.visit('/application/admin')
    cy.location('pathname').should('eq', '/application/admin')
  })
})
