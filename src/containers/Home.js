import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import LoadingIndicator from "../components/LoadingIndicator";
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [searchNotes, setSearchNotes] = useState([]);
  const [searchData, setSearchData] = useState({ search: "" });
  const [searchHeader, setSearchHeader] = useState("");

  useEffect(() => {
    setIsLoading(true);
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"} Create a new note</b>
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <div className="scratch-container">
          <h1>Scratch</h1>
          <div className="scratch-underline" />
        </div>
        <p>A simple note taking app</p>
        <div>
          <Link to="/login" className="btn LoaderButton btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn signup-button btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  // update the search value on every change made to the input
  function handleFormChange(evt) {
    let { name, value } = evt.target;
    setSearchData((data) => ({ ...data, [name]: value }));
  }

  function handleSearchSubmit(evt) {
    evt.preventDefault();
    // filter through notes for notes that contain the searched string
    let newSearchNotes = notes.filter((note) =>
      note.content.includes(searchData.search)
    );
    // set a header depending on length of searched result
    if (newSearchNotes.length) {
      setSearchNotes(newSearchNotes);
      if (newSearchNotes.length === 1) setSearchHeader("1 result found");
      else setSearchHeader(`${newSearchNotes.length} results found`);
    } else {
      setSearchNotes([]);
      setSearchHeader("No results found");
    }
    // clear the search value from input on submit
    setSearchData({ search: "" });
  }

  // reset all search state
  function clearSearch() {
    setSearchNotes([]);
    setSearchHeader("");
  }

  function renderNotes() {
    return (
      <div className="notes">
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <PageHeader>
              <div className="header-container">
                <div className="header-title-container">
                  Your Notes <div className="your-notes-underline" />
                </div>
                <form className="search-form" onSubmit={handleSearchSubmit}>
                  <input
                    name="search"
                    value={searchData.search}
                    onChange={handleFormChange}
                    placeholder="Search notes"
                  ></input>
                </form>
              </div>
            </PageHeader>
            {searchHeader.length ? (
              <>
                <div className="search-results-header-container">
                  <div className="search-results-header">{searchHeader}</div>
                  <button
                    className="btn LoaderButton clear-search"
                    onClick={clearSearch}
                  >
                    Clear Search
                  </button>
                </div>
                <ListGroup>{renderNotesList(searchNotes)}</ListGroup>
              </>
            ) : (
              <ListGroup>{renderNotesList(notes)}</ListGroup>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
