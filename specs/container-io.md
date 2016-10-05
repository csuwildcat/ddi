# Identity Container I/O

In order to maximize data interoperability and accessibility between identity containers, and other systems that will consume identity data (crawlers, apps, etc.), it is important to create a globally recognized API based on a recognized query format that explicitly maps to semantic, expected data objects.

## Well-Known URI

To enable both identity containers and existing severs of Web content to interact with the world of identity via the Identity Container APIs, we are using the IETF convention for globally defined resources that predictably reside at well known locations, as detailed in [RFC 5785 well-know URIs][13f07ee0] and the [well-known URI directory][6cc282d2]. The `well-know` URI suffix shall be `identity`, thus identity containers are accessible via the path: `/.well-know/identity`.

## Primary Identity Object

The owning entity's primary descriptor object shall reside at the path `/.well-know/identity/profile`, and should return whatever Schema.org object type best represents the entity.

## Query API

To maximize reuse of existing standards and open source projects, The Query API is an implementation of the common [JSON API specification's][2773b365] request, response, and query formats, that relies on Schema.org's data ontology to define a standard set of types, parameter values, and response objects.

The Query API shall be accessible at the following path `/.well-know/identity/query/v0.1`, and should follow the request format specified by the JSON API documentation here: http://jsonapi.org/format/#fetching. Note: the `Accept` type for requests should be set to `application/vnd.api+json`.

Queries should be sent as `GET` requests, and the query's route should always be a Schema.org object type, for example:

`/.well-know/identity/query/v0.1/`*`MusicPlaylist`*

The object type appear in Schema.org with PascalCased names (as opposed to camelCased), but Query API implementations shall be case *insensitive*. Regardless of pluralization of a Schema.org object type's name, requests for a type will always return an array of all objects of that type via the response object's `data` property, as shown here:

```json
{
  "links": {
    "self": "/.well-know/identity/query/v0.1/MusicPlaylist"
  },
  "data": [{
  "@context": "http://schema.org",
  "@type": "MusicPlaylist",
  "name": "Classic Rock Playlist",
  "numTracks": "2",
  "track": [{
      "@type": "MusicRecording",
      "byArtist": "Lynard Skynard",
      "duration": "PT4M45S",
      "inAlbum": "Second Helping",
      "name": "Sweet Home Alabama",
      "permit": "/.well-know/identity/query/v0.1/Permit/sweet-home-alabama"
    },
    {
      "@type": "MusicRecording",
      "byArtist": "Bob Seger",
      "duration": "PT3M12S",
      "inAlbum": "Stranger In Town",
      "name": "Old Time Rock and Roll",
      "permit": "/.well-know/identity/query/v0.1/Permit/old-time-rock-and-roll"
    }]
  }]
}
```

#### Query Filters

The following are the minimum set of supported filters for an identity container implementation to pass validation and be recognized as conforming to version 0.1 of the API:

...TBD...


  [13f07ee0]: https://tools.ietf.org/html/rfc5785 "IETF well-know URIs"
  [6cc282d2]: https://www.ietf.org/assignments/well-known-uris/well-known-uris.xml "well-known URI Directory"
  [2773b365]: http://jsonapi.org/format/ "JSON API Spec"
