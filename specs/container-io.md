# Identity Container I/O

In order to maximize data interoperability and accessibility between identity containers, and other systems that will consume identity data (crawlers, apps, etc.), it is important to create a globally recognized API based on a recognized query format that explicitly maps to semantic, expected data objects.

## Well-Known URI

The following API leverages the existing IETF convention for accessing resources that predictably reside at well known locations, as detailed in [RFC 5785 well-know URIs][13f07ee0] and the [well-known URI directory][6cc282d2]. The `well-know` URI suffix shall be `identity`, thus identity containers are accessible via the path: `/.well-know/identity`.

## Primary Identity Object

The owning entity's primary descriptor object shall reside at the path `/.well-know/identity/profile`, and should return whatever Schema.org object type best represents the entity.

## Query API

To maximize reuse of existing standards and open source projects, The Query API is an implementation of the common [JSON API specification's][2773b365] request, response, and query formats, that relies on Schema.org's data ontology to define a standard set of types, parameter values, and response objects.

The Query API shall be accessible at the following path `/.well-know/identity/query`, and should follow the request format specified by the JSON API documentation here: http://jsonapi.org/format/#fetching. Note: the `Accept` type for requests should be set to `application/vnd.api+json`.

Queries should be sent as `GET` requests, and the query's route should always be a Schema.org object type, for example:

`/.well-know/identity/query/`*`MusicComposition`*

The object type appear in Schema.org with PascalCased names (as opposed to camelCased), but Query API implementations shall be case *insensitive*. Regardless of pluralization of a Schema.org object type's name, requests for a type will always return an array of all objects of that type via the response object's `data` property, as shown here:

```json
{
  "links": {
    "self": "/.well-know/identity/query/MusicComposition"
  },
  "data": [{
    "@context": "http://schema.org",
    "@type": "MusicRecording",
    "@id": "http://musicbrainz.org/recording/3566e453-8f10-4a45-ac85-2c72eb183ca1",
    "name": "Back in the U.S.S.R.",
    "producer": {
        "@type": "Person",
        "name": "George Martin"
    },
    "duration": "PT2M43S",
    "recordingOf": {
        "@type": "MusicComposition",
        "name": "Back in the U.S.S.R",
        "iswcCode": "T-010.140.236-1"
    }
  }]
}
```

#### Query Filters

The following are the minimum set of supported filters for an identity container implementation to pass validation and be recognized as conforming:

...TBD...


  [13f07ee0]: https://tools.ietf.org/html/rfc5785 "IETF well-know URIs"
  [6cc282d2]: https://www.ietf.org/assignments/well-known-uris/well-known-uris.xml "well-known URI Directory"
  [2773b365]: http://jsonapi.org/format/ "JSON API Spec"
