declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login
     * @example cy.login('email', 'password')
     */
    login(email: string, password: string): Chainable<Element>
  }
}
