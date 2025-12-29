import React, { useState, useEffect } from "react";
import "./Courses.css";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../services/api";

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

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  // Add a new course
  const addCourse = async () => {
    if (newCourseName.trim()) {
      try {
        const newCourse = {
          name: newCourseName,
          folders: [],
          documents: []
        };
        const created = await createCourse(newCourse);
        setCourses([...courses, created]);
        setNewCourseName("");
        setShowNewCourseModal(false);
      } catch (error) {
        console.error("Error creating course:", error);
      }
    }
  };

  // Helper to sync changes
  const syncCourseUpdate = async (updatedCourse) => {
    try {
      await updateCourse(updatedCourse._id, {
        folders: updatedCourse.folders,
        documents: updatedCourse.documents
      });
      setCourses(courses.map(c => c._id === updatedCourse._id ? updatedCourse : c));
      setSelectedCourse(updatedCourse);
    } catch (error) {
      console.error("Error syncing course:", error);
      // Revert or alert? For PoC, just log.
    }
  };

  // Add a folder to a course or subfolder
  const addFolder = () => {
    if (newFolderName.trim() && selectedCourse) {
      const newFolder = {
        id: Date.now().toString(), // Helper ID for nested structure
        name: newFolderName,
        folders: [],
        documents: [],
        createdAt: new Date().toLocaleDateString(),
      };

      let updatedCourse = { ...selectedCourse };
      if (currentPath.length === 0) {
        updatedCourse.folders = [...updatedCourse.folders, newFolder];
      } else {
        updatedCourse = addFolderRecursive(updatedCourse, currentPath, newFolder);
      }

      syncCourseUpdate(updatedCourse);

      setNewFolderName("");
      setShowNewFolderModal(false);
    }
  };

  const addFolderRecursive = (item, path, newFolder) => {
    if (path.length === 0) return { ...item, folders: [...item.folders, newFolder] }; // Should not strictly ideally happen if logic is correct
    if (path.length === 1 && path[0] === item.id) {
      return { ...item, folders: [...(item.folders || []), newFolder] };
    }

    const [first, ...rest] = path;
    // Special handling for top level if item is the course itself (no id in path start usually if path is folder IDs)
    // Actually currentPath is list of folder IDs.
    // So if function called with Course, it needs to find folder 'first' in its folders.

    // Correction: currentPath items are folder IDs.
    // The recursive function logic in original code:
    // path[0] === item.id check assumes item has that ID.
    // If called on Course, Course has _id. Folders have 'id'.
    // Let's stick to the original logic structure but adapt:

    return {
      ...item,
      folders: item.folders.map((folder) => {
        // If this folder is the one we are looking for (first path item)
        if (folder.id === first) {
          if (path.length === 1) {
            return { ...folder, folders: [...folder.folders, newFolder] };
          } else {
            return addFolderRecursive(folder, rest, newFolder);
          }
        }
        return folder;
      }),
    };
  };

  // Since original recursion was a bit weird (path[0] === item.id?), let's rewrite it cleanly.
  // path is [folderId1, folderId2].
  // We want to go deep into folderId1 -> folderId2 -> output.
  const updateCourseDeep = (course, path, updateFn) => {
    // If path is empty, we update the course itself
    if (path.length === 0) {
      return updateFn(course);
    }

    // Otherwise we map folders
    return {
      ...course,
      folders: course.folders.map(folder => {
        if (folder.id === path[0]) {
          // Found the folder in this level
          if (path.length === 1) {
            // This is the target folder
            return updateFn(folder);
          } else {
            // Go deeper
            return updateCourseDeep(folder, path.slice(1), updateFn);
          }
        }
        return folder;
      })
    };
  };


  const addFolderRefined = () => {
    if (newFolderName.trim() && selectedCourse) {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName,
        folders: [],
        documents: [],
        createdAt: new Date().toLocaleDateString(),
      };

      const updatedCourse = updateCourseDeep(selectedCourse, currentPath, (item) => ({
        ...item,
        folders: [...(item.folders || []), newFolder]
      }));

      syncCourseUpdate(updatedCourse);
      setNewFolderName("");
      setShowNewFolderModal(false);
    }
  };

  // Upload document
  const handleFileUploadRefined = (event) => {
    const files = Array.from(event.target.files);
    if (files.length && selectedCourse) {
      const newDocuments = files.map((file) => ({
        id: Date.now().toString() + Math.random().toString(),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type || "unknown",
        uploadedAt: new Date().toLocaleDateString(),
      }));

      const updatedCourse = updateCourseDeep(selectedCourse, currentPath, (item) => ({
        ...item,
        documents: [...(item.documents || []), ...newDocuments]
      }));

      syncCourseUpdate(updatedCourse);
      setShowUploadModal(false);
    }
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
      if (!current.folders) return null;
      current = current.folders.find((f) => f.id === folderId);
      if (!current) return null;
    }
    return current;
  };

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(courseId);
        setCourses(courses.filter((c) => c._id !== courseId));
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  // Delete folder
  const handleDeleteFolder = (folderId) => {
    if (window.confirm("Are you sure you want to delete this folder?")) {
      const updatedCourse = updateCourseDeep(selectedCourse, currentPath, (item) => ({
        ...item,
        folders: item.folders.filter(f => f.id !== folderId)
      }));
      syncCourseUpdate(updatedCourse);
    }
  };

  // Delete document
  const handleDeleteDocument = (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      const updatedCourse = updateCourseDeep(selectedCourse, currentPath, (item) => ({
        ...item,
        documents: item.documents.filter(d => d.id !== docId)
      }));
      syncCourseUpdate(updatedCourse);
    }
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
                <div key={course._id} className="course-card" onClick={() => openCourse(course)}>
                  <div className="card-header">
                    <span className="course-icon">📖</span>
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course._id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                  <h3>{course.name}</h3>
                  <div className="card-info">
                    <span>📁 {course.folders ? course.folders.length : 0} folders</span>
                    <span>📄 {course.documents ? course.documents.length : 0} files</span>
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
              {currentContent?.folders && currentContent.folders.map((folder) => (
                <div key={folder.id} className="item-card folder-card" onClick={() => openFolder(folder)}>
                  <div className="item-header">
                    <span className="item-icon">📁</span>
                    <button
                      className="btn-delete-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <h4>{folder.name}</h4>
                  <div className="item-info">
                    <span>{folder.folders ? folder.folders.length : 0} folders</span>
                    <span>{folder.documents ? folder.documents.length : 0} files</span>
                  </div>
                </div>
              ))}

              {/* Documents */}
              {currentContent?.documents && currentContent.documents.map((doc) => (
                <div key={doc.id} className="item-card document-card">
                  <div className="item-header">
                    <span className="item-icon">{getFileIcon(doc.type)}</span>
                    <button
                      className="btn-delete-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
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

              {(!currentContent?.folders || currentContent.folders.length === 0) && (!currentContent?.documents || currentContent.documents.length === 0) && (
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
              onKeyPress={(e) => e.key === "Enter" && addFolderRefined()}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowNewFolderModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={addFolderRefined}>
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
                onChange={handleFileUploadRefined}
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
