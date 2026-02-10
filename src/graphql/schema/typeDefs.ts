export const typeDefs = `#graphql
  type User {
    id: ID!
    auth0Id: String!
    email: String!
    name: String
    notes: [Note!]!
    createdAt: String!
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    userId: String!
    user: User!
    createdAt: String!
  }

  type Query {
    me: User
    myNotes: [Note!]!
    note(id: ID!): Note
  }

  input CreateNoteInput {
    title: String!
    content: String!
  }

  input UpdateNoteInput {
    title: String
    content: String
  }

  type Mutation {
    createNote(input: CreateNoteInput!): Note!
    updateNote(id: ID!, input: UpdateNoteInput!): Note!
    deleteNote(id: ID!): Boolean!
  }
`;