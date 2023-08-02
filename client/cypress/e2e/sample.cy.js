describe("Phonebook CI/CD", function () {
  it("front page can be opened", function () {
    cy.visit("http://localhost:3001");
    cy.contains("Phonebook");
    cy.contains("Add new contact");
    cy.contains("Numbers");
  });
  it('should have a delete button in each list item', () => {
    cy.visit("http://localhost:3001");
    cy.get('ul > li').each(($li) => {
      cy.wrap($li).should('contain', 'Delete');
    });
  })
})