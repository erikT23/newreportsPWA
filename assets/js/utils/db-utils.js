const indicencesDB = new PouchDB("incidences");

const saveIncidences = (incidence) => {
  incidence._id = new Date().toISOString();
  return indicencesDB
    .put(incidence)
    .then((result) => {
      self.registration.sync.register("incidence-post");

      const response = {
        registered: true,
        offline: true,
      };
      return new Response(JSON.stringify(response));
    })
    .catch((err) => {
      console.log(err);
      const response = {
        registered: false,
        offline: true,
      };
    });
};

const savePostIncidence = () => {
  const incidences = [];
  return indicencesDB.allDocs({ include_docs: true }).then(async (docs) => {
    const { rows } = docs;
    for (const row of rows) {
      const { doc } = row;
      const response = await fetch(
        "http://206.189.234.55:3000/api/incidences/status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doc),
        }
      );
      const data = await response.json();
      if (data["changed"]) {
        incidences.push(response);
        return indicencesDB.remove(doc);
      }
    }
    return Promise.all([...incidences, getAllIncidencesPending()]);
  });
};
