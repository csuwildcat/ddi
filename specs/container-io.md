# Identity Container I/O

In order to maximize data interoperability and accessibility between identity containers, and other systems that will interact with identity data (crawlers, apps, etc.), it is important to create a globally recognized API based on a recognized query format that explicitly maps to semantic, expected data objects.

## Well-Known URI

To enable both identity containers and existing severs of Web content to interact with the world of identity via the Identity Container APIs, we are using the IETF convention for globally defined resources that predictably reside at well known locations, as detailed in [RFC 5785 well-known URIs][13f07ee0] and the [well-known URI directory][6cc282d2]. The `well-known` URI suffix shall be `identity`, thus identity containers are accessible via the path: `/.well-known/identity`.

## Authentication

The process of authenticating requests from the primary user or an agent shall follow the FIDO and Web Authentication specifications. These specifications may require modifications in order to support challenging globally known IDs with provably linked keys.

## API Routes

There are a handful of default, top-level endpoints that have defined meaning within the system, those are:

  `/.well-known/identity/`*`profile`* ➜ The owning entity's primary descriptor object

  `/.well-known/identity/`*`permissions`* ➜ The access control JSON document

  `/.well-known/identity/`*`connections`* ➜ Scoped storage space for user-permitted external entities

  `/.well-known/identity/`*`data`* ➜ The owning entity's identity data (access limited)

#### The Profile Object

One universal object you can expect nearly every container to have is a `profile`. This is the owning entity's primary descriptor object. The object should be encoded in the format of whatever Schema.org type best represents the entity. Here is an example of using the Schema.org `Person` schema to express that an identity is that of a human being:

```json
{
    "@type": "Person",
    "name": "Daniel Buchner",
    "description": "Working on decentralize identity at Microsoft",
    "website": [
      {
        "@type": "WebSite",
        "url": "http://www.backalleycoder.com/"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Los Gatos, CA"      
    }
}
```

#### Permissions

All access and manipulation of identity data is subject to the permissions established by the owning entity. Because the identities are self-sovereign, all data associated with the identity must be portable. Transfer of a container between environments and hosts should be seamless, without loss of data or operational state, including the permissions that govern access to identity data.

These permissions are declared in a TBD, which you can read more about in the documentation here: TBD. This access control document dictates what data the owning entity publicly exposes, as well as the permissions for Connections the entity creates with other entities across the web of identity, whether they are humans, apps, services, devices, etc.

#### Connections

Connections are other entities that are given permission to create, read, update, or delete identity data, as well as subscribe to a number of callback hooks. Connections are given an addressable data space within the owning identity's container under the `connections` top-level path, accessible within that path based on the entity's decentralize identifier or a recognized public key. Here's an example of the path format:

`/.well-known/identity/connections/`*`ENTITY_ID_OR_PUBLIC_KEY`*

#### Data

The full scope of an identity's data is accessible via the following path `/.well-known/identity/data`, wherein the path structure is a flat map of object type names that is a 1:1 mirror of Schema.org's structured data schema. The names of the types are `PascalCased` on Schema.org, but container implementations should be *case insensitive*. Here are a few examples of actual paths and the type of Schema.org objects they will respond with:

`/.well-known/identity/data/Event` ➜ http://schema.org/Event

`/.well-known/identity/data/Invoice` ➜ http://schema.org/Invoice

`/.well-known/identity/data/Photograph` ➜ http://schema.org/Photograph

The intent is to provide a known path for accessing standardized, semantic objects reliably across all containers, but do so in way that asserts as little opinion as possible. While deeper path taxonomies are helpful for some use-cases, we feel a path taxonomy is best left as a UI layer User Agents, apps, and services can overlay at their discretion.

## Request/Response Format

To maximize reuse of existing standards and open source projects, The REST API uses [JSON API's specification][2773b365] for request, response, and query formats, and leverages Schema.org's standard data set for encoding stored data and response objects. Requests should be formatted in accordance with the JSON API documentation: http://jsonapi.org/format/#fetching. Note: the `Accept` header parameter for requests should be set to `application/vnd.api+json`.

#### Example Request

Requests should be sent as `GET`, and the query's route should follow the common Identity Container Taxonomy. Here is an example of how to request an identity's music playlists:

`/.well-know/identity/data/`*`MusicPlaylist`*

Requests will always return an array of all objects - *the user has given you access to* - of the related Schema.org type, via the response object's `data` property, as shown here:

```json
{
  "links": {
    "self": "/.well-known/identity/data/musicplaylist"
  },
  "data": [{
  "@context": "http://schema.org",
  "@type": "MusicPlaylist",
  "name": "Classic Rock Playlist",
  "numTracks": 2,
  "track": [{
      "@type": "MusicRecording",
      "byArtist": "Lynard Skynyrd",
      "duration": "PT4M45S",
      "inAlbum": "Second Helping",
      "name": "Sweet Home Alabama",
      "permit": "/.well-known/identity/data/permit/ced043360b99"
    },
    {
      "@type": "MusicRecording",
      "byArtist": "Bob Seger",
      "duration": "PT3M12S",
      "inAlbum": "Stranger In Town",
      "name": "Old Time Rock and Roll",
      "permit": "/.well-known/identity/data/permit/aa9f3ac9eb7a"
    }]
  }]
}
```

#### Query Syntax

While the Identity Container spec does not mandate specific storage and search solutions, but for the purposes of interoperability and developer ergonomics containers must accept a common search and filtering syntax regardless of the underlying implementation.

Current thinking is to use the common Apache Lucene query syntax to allow passage of string-based queries, as detailed in the Elastic Search docs: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html


  [13f07ee0]: https://tools.ietf.org/html/rfc5785 "IETF well-know URIs"
  [6cc282d2]: https://www.ietf.org/assignments/well-known-uris/well-known-uris.xml "well-known URI Directory"
  [2773b365]: http://jsonapi.org/format/ "JSON API Spec"
