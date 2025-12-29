import React, { useState } from "react";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Add a new course
  const addCourse = () => {
    if (newCourseName.trim()) {  // Check if name is not empty
      const newCourse = {
        id: Date.now(),
        name: newCourseName,
        folders: [],
        documents: [],
        createdAt: new Date().toLocaleDateString(),
      };
      setCourses([...courses, newCourse]);
      setNewCourseName("");
      setShowNewCourseModal(false);
    }
  };

  // Add a folder to a course or subfolder
  const addFolder = () => {
    if (newFolderName.trim() && selectedCourse) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName,
        folders: [],
        documents: [],
        createdAt: new Date().toLocaleDateString(),
      };

      const updatedCourses = courses.map((course) => {
        if (course.id === selectedCourse.id) {
          if (currentPath.length === 0) {
            return { ...course, folders: [...course.folders, newFolder] };
          } else {
            return addFolderRecursive(course, currentPath, newFolder);
          }
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      // Update selectedCourse to reflect the new state
      const updatedCourse = updatedCourses.find(c => c.id === selectedCourse.id);
      setSelectedCourse(updatedCourse);

      setNewFolderName("");
      setShowNewFolderModal(false);
    }
  };

  // Recursive function to add folder to nested structure
  const addFolderRecursive = (item, path, newFolder) => {
    if (path.length === 0) return item;
    if (path.length === 1 && path[0] === item.id) {
      return { ...item, folders: [...item.folders, newFolder] };
    }

    const [first, ...rest] = path;
    return {
      ...item,
      folders: item.folders.map((folder) =>
        folder.id === first ? addFolderRecursive(folder, rest, newFolder) : folder
      ),
    };
  };

  // Upload document
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length && selectedCourse) {
      const newDocuments = files.map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type || "unknown",
        uploadedAt: new Date().toLocaleDateString(),
      }));

      const updatedCourses = courses.map((course) => {
        if (course.id === selectedCourse.id) {
          if (currentPath.length === 0) {
            return { ...course, documents: [...course.documents, ...newDocuments] };
          } else {
            return addDocumentsRecursive(course, currentPath, newDocuments);
          }
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      // Update selectedCourse to reflect the new state
      const updatedCourse = updatedCourses.find(c => c.id === selectedCourse.id);
      setSelectedCourse(updatedCourse);

      setShowUploadModal(false);
    }
  };

  // Recursive function to add documents to nested structure
  const addDocumentsRecursive = (item, path, newDocuments) => {
    if (path.length === 0) return item;
    if (path.length === 1 && path[0] === item.id) {
      return { ...item, documents: [...item.documents, ...newDocuments] };
    }

    const [first, ...rest] = path;
    return {
      ...item,
      folders: item.folders.map((folder) =>
        folder.id === first ? addDocumentsRecursive(folder, rest, newDocuments) : folder
      ),
    };
  };

  // Navigate into a course
  const openCourse = (course) => {
    setSelectedCourse(course);
    setCurrentPath([]);
  };

  // Navigate into a folder
  const openFolder = (folder) => {
    setCurrentPath([...currentPath, folder.id]);
  };

  // Navigate back
  const goBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    } else {
      setSelectedCourse(null);
    }
  };

  // Get current folder content
  const getCurrentContent = () => {
    if (!selectedCourse) return null;

    let current = selectedCourse;
    for (const folderId of currentPath) {
      current = current.folders.find((f) => f.id === folderId);
      if (!current) return null;
    }
    return current;
  };

  // Delete course
  const deleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== courseId));
    }
  };

  // Delete folder
  const deleteFolder = (folderId) => {
    if (window.confirm("Are you sure you want to delete this folder?")) {
      const updatedCourses = courses.map((course) => {
        if (course.id === selectedCourse.id) {
          return deleteFolderRecursive(course, currentPath, folderId);
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      // Update selectedCourse to reflect the new state
      const updatedCourse = updatedCourses.find(c => c.id === selectedCourse.id);
      setSelectedCourse(updatedCourse);
    }
  };

  // Recursive delete folder
  const deleteFolderRecursive = (item, path, folderId) => {
    if (path.length === 0) {
      return { ...item, folders: item.folders.filter((f) => f.id !== folderId) };
    }

    const [first, ...rest] = path;
    return {
      ...item,
      folders: item.folders.map((folder) =>
        folder.id === first ? deleteFolderRecursive(folder, rest, folderId) : folder
      ),
    };
  };

  // Delete document
  const deleteDocument = (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      const updatedCourses = courses.map((course) => {
        if (course.id === selectedCourse.id) {
          return deleteDocumentRecursive(course, currentPath, docId);
        }
        return course;
      });
      
      setCourses(updatedCourses);
      
      // Update selectedCourse to reflect the new state
      const updatedCourse = updatedCourses.find(c => c.id === selectedCourse.id);
      setSelectedCourse(updatedCourse);
    }
  };

  // Recursive delete document
  const deleteDocumentRecursive = (item, path, docId) => {
    if (path.length === 0) {
      return { ...item, documents: item.documents.filter((d) => d.id !== docId) };
    }

    const [first, ...rest] = path;
    return {
      ...item,
      folders: item.folders.map((folder) =>
        folder.id === first ? deleteDocumentRecursive(folder, rest, docId) : folder
      ),
    };
  };

  // Filter courses based on search
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentContent = getCurrentContent();

  return (
    <div className="courses-container">
      <div className="courses-header">
        <div className="header-left">
          <h1>📚 My Courses</h1>
          <p>Organize your learning materials</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {!selectedCourse && (
            <button className="btn-primary" onClick={() => setShowNewCourseModal(true)}>
              ➕ New Course
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {selectedCourse && (
        <div className="breadcrumb">
          <button className="breadcrumb-btn" onClick={() => setSelectedCourse(null)}>
            🏠 All Courses
          </button>
          <span className="separator">/</span>
          <button 
            className="breadcrumb-btn active" 
            onClick={() => setCurrentPath([])}
          >
            {selectedCourse.name}
          </button>
          {currentPath.length > 0 && (
            <>
              {currentPath.map((folderId, index) => {
                let folder = selectedCourse;
                for (let i = 0; i <= index; i++) {
                  folder = folder.folders.find((f) => f.id === currentPath[i]);
                }
                return (
                  <React.Fragment key={folderId}>
                    <span className="separator">/</span>
                    <button 
                      className="breadcrumb-btn active"
                      onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                    >
                      {folder?.name}
                    </button>
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="courses-content">
        {!selectedCourse ? (
          // Show all courses
          <div className="courses-grid">
            {filteredCourses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No courses yet</h3>
                <p>Create your first course to get started</p>
                <button className="btn-primary" onClick={() => setShowNewCourseModal(true)}>
                  Create Course
                </button>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div key={course.id} className="course-card" onClick={() => openCourse(course)}>
                  <div className="card-header">
                    <span className="course-icon">📖</span>
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCourse(course.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  <h3>{course.name}</h3>
                  <div className="card-info">
                    <span>📁 {course.folders.length} folders</span>
                    <span>📄 {course.documents.length} files</span>
                  </div>
                  <div className="card-date">Created: {course.createdAt}</div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Show course content
          <div className="course-view">
            <div className="course-toolbar">
              <button className="btn-secondary" onClick={goBack}>
                ⬅️ Back
              </button>
              <div className="toolbar-actions">
                <button
                  className="btn-action"
                  onClick={() => {
                    setShowNewFolderModal(true);
                  }}
                >
                  📁 New Folder
                </button>
                <button
                  className="btn-action"
                  onClick={() => {
                    setShowUploadModal(true);
                  }}
                >
                  📤 Upload Document
                </button>
              </div>
            </div>

            <div className="content-grid">
              {/* Folders */}
              {currentContent?.folders.map((folder) => (
                <div key={folder.id} className="item-card folder-card" onClick={() => openFolder(folder)}>
                  <div className="item-header">
                    <span className="item-icon">📁</span>
                    <button
                      className="btn-delete-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <h4>{folder.name}</h4>
                  <div className="item-info">
                    <span>{folder.folders.length} folders</span>
                    <span>{folder.documents.length} files</span>
                  </div>
                </div>
              ))}

              {/* Documents */}
              {currentContent?.documents.map((doc) => (
                <div key={doc.id} className="item-card document-card">
                  <div className="item-header">
                    <span className="item-icon">{getFileIcon(doc.type)}</span>
                    <button
                      className="btn-delete-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocument(doc.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <h4>{doc.name}</h4>
                  <div className="item-info">
                    <span>{doc.size}</span>
                    <span>{doc.uploadedAt}</span>
                  </div>
                </div>
              ))}

              {currentContent?.folders.length === 0 && currentContent?.documents.length === 0 && (
                <div className="empty-folder">
                  <span className="empty-icon">📭</span>
                  <p>This folder is empty</p>
                  <p className="empty-hint">Add folders or upload documents to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Course Modal */}
      {showNewCourseModal && (
        <div className="modal-overlay" onClick={() => setShowNewCourseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Course</h2>
            <input
              type="text"
              placeholder="Course name"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCourse()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowNewCourseModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={addCourse}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="modal-overlay" onClick={() => setShowNewFolderModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addFolder()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowNewFolderModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={addFolder}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Upload Documents</h2>
            <div className="upload-area">
              <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="upload-label">
                <span className="upload-icon">📤</span>
                <p>Click to select files</p>
                <p className="upload-hint">or drag and drop</p>
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get file icon based on type
const getFileIcon = (type) => {
  if (type.includes("pdf")) return "📕";
  if (type.includes("word") || type.includes("doc")) return "📘";
  if (type.includes("excel") || type.includes("sheet")) return "📊";
  if (type.includes("powerpoint") || type.includes("presentation")) return "📊";
  if (type.includes("image")) return "🖼️";
  if (type.includes("video")) return "🎥";
  if (type.includes("audio")) return "🎵";
  if (type.includes("zip") || type.includes("rar")) return "📦";
  return "📄";
};

export default Courses;
